const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const requiredEnvironment = [
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_DRIVE_FOLDER_ID",
];

const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length > 0) {
  throw new Error(`Environment variable belum lengkap: ${missingEnvironment.join(", ")}`);
}

const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const outputPath = path.resolve(process.cwd(), "src/data/CertificateData.json");
const folderMimeType = "application/vnd.google-apps.folder";

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encodeBase64Url(
    JSON.stringify({
      iss: process.env.GOOGLE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const unsignedToken = `${header}.${claims}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsignedToken), privateKey).toString("base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsignedToken}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Autentikasi Google gagal (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function listChildren(accessToken, folderId) {
  const files = [];
  let pageToken = "";

  do {
    const parameters = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken,files(id,name,mimeType,description,createdTime,modifiedTime,webViewLink,thumbnailLink,properties)",
      orderBy: "folder,name",
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

    if (pageToken) parameters.set("pageToken", pageToken);

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${parameters}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Gagal membaca folder Drive (${response.status}): ${await response.text()}`);
    }

    const data = await response.json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return files;
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFilename(filename) {
  const basename = filename.replace(/\.[^.]+$/, "");
  const parts = basename.split("__").map((part) => part.trim());

  if (parts.length < 2) return {};

  const [issueDate, issuer, title, category, credentialId] = parts;
  return { issueDate, issuer, title, category, credentialId };
}

function normalizeCertificate(file, directories) {
  const filenameMetadata = parseFilename(file.name);
  const properties = file.properties || {};
  const category = properties.category || filenameMetadata.category || directories[0] || "Sertifikat";
  const issuer = properties.issuer || filenameMetadata.issuer || directories.at(-1) || "Penerbit tidak dicantumkan";

  return {
    id: file.id,
    driveFileId: file.id,
    title: properties.title || filenameMetadata.title || titleFromFilename(file.name),
    issuer,
    description: properties.description || file.description || "",
    category,
    categories: directories,
    issueDate: properties.issueDate || filenameMetadata.issueDate || file.createdTime?.slice(0, 10) || "",
    credentialId: properties.credentialId || filenameMetadata.credentialId || "",
    credentialUrl: properties.credentialUrl || "",
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    mimeType: file.mimeType,
    thumbnailLink: file.thumbnailLink || "",
    fileName: file.name,
    modifiedTime: file.modifiedTime || "",
  };
}

async function readFolder(accessToken, folderId, directories = []) {
  const children = await listChildren(accessToken, folderId);
  const nestedCertificates = await Promise.all(
    children.map(async (file) => {
      if (file.mimeType === folderMimeType) {
        return readFolder(accessToken, file.id, [...directories, file.name]);
      }

      return [normalizeCertificate(file, directories)];
    })
  );

  return nestedCertificates.flat();
}

async function syncCertificates() {
  const accessToken = await getAccessToken();
  const certificates = await readFolder(accessToken, process.env.GOOGLE_DRIVE_FOLDER_ID);

  certificates.sort((first, second) => {
    const dateDifference = (second.issueDate || "").localeCompare(first.issueDate || "");
    return dateDifference || first.title.localeCompare(second.title, "id");
  });

  await fs.writeFile(outputPath, `${JSON.stringify(certificates, null, 2)}\n`);
  process.stdout.write(`${certificates.length} sertifikat disinkronkan ke src/data/CertificateData.json\n`);
}

syncCertificates().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
