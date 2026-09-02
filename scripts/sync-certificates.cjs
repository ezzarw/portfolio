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
  process.stdout.write(`Environment variable belum lengkap: ${missingEnvironment.join(", ")}. Melewati sinkronisasi Google Drive.\n`);
  process.exit(0);
}

const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const outputPath = path.resolve(process.cwd(), "src/data/CertificateData.json");
const folderMimeType = "application/vnd.google-apps.folder";

// Factual Verified Metadata Map extracted directly via OCR & Document Inspection
const FACTUAL_METADATA_MAP = {
  "1B7XPE7QCtN8_2zigR21rPTHMq-9m9Evp": {
    title: "International Code Olympiad 2025 - Web Development",
    issuer: "Coding Bee Academy",
    description: "Sertifikat Juara 3 (3rd Place Winner) pada International Code Olympiad 2025 Innovation Challenge: Web Development.",
    issueDate: "2025-07-20",
    featured: true,
  },
  "1mOR4JFxJSH90k2IdNSQC262Ny1PqhlQI": {
    title: "Cyber Jawara 2025",
    issuer: "CSIRT.ID & ID-SIRTII",
    description: "Sertifikat Finalis Kategori SMA/SMK kompetisi hacking nasional Cyber Jawara 2025 (Tim: Murid DWP) di Bogor.",
    issueDate: "2026-04-18",
    featured: true,
  },
  "1LLw_Alc6VYDVjD25lgffXOsbgO7RYyoW": {
    title: "CTF ARA 7.0",
    issuer: "HMIT ITS (Departemen Teknologi Informasi ITS)",
    description: "Sertifikat Finalis kompetisi Capture The Flag ARA 7.0 Institut Teknologi Sepuluh Nopember.",
    issueDate: "2026-02-28",
    credentialId: "448/SER/ARA/RISTEK/HMIT-ITS/II/2026",
    featured: true,
  },
  "1xWd-WGW3O9cNwpgXnoM68jzOfvxd1giM": {
    title: "FITCOM 3.0 Cyber Security Competition",
    issuer: "Universitas Dinamika & Disdik Jatim",
    description: "Sertifikat Finalis Lomba Cyber Security FITCOM 3.0 (Faculty of Informatics Technology Competition) Universitas Dinamika.",
    issueDate: "2025-10-23",
    credentialId: "350/FTI/FITCOM/SL/X/2025",
    featured: true,
  },
  "12ehoZMQzZPuNYpZAvNR2MHjg60mye4u4": {
    title: "Steven Capture The Flag (SCTF) 2026",
    issuer: "Darmajaya Cyber Security Club (DCSC)",
    description: "Sertifikat Top 14 Steven Capture The Flag (SCTF) Tingkat Nasional 2026 (Tim: SCS - mon0xside) di Kampus IIB Darmajaya.",
    issueDate: "2026-07-03",
    credentialId: "DCSC/SCTF/2026/151",
    featured: true,
  },
  "1JQHjsSxhqUwi-kLV2Mwt75jXAoG-rqfj": {
    title: "Cyber Security Officer - Telkom DigiUp 2025",
    issuer: "Telkom Indonesia & PT TPCC",
    description: "Sertifikat kelulusan resmi program sertifikasi Cyber Security Officer Telkom DigiUp 2025 (Nilai: Certified / Grade Lulus).",
    issueDate: "2025-12-22",
    credentialId: "D2501162",
    featured: true,
  },
  "1h7OZn95hEBAPAIKpqNZXmH0bHtcMM3WV": {
    title: "Capture The Flag - Arkavidia 10.0",
    issuer: "HMIF ITB (Himpunan Mahasiswa Informatika ITB)",
    description: "Sertifikat apresiasi partisipasi pada kompetisi Capture The Flag Arkavidia 10.0 ITB.",
    issueDate: "2026-04-24",
  },
  "1iL5kMMq-JeF5U3z3Otxk2p-mkXYyiwdJ": {
    title: "NETCOMP 4.0 Cybersecurity Competition",
    issuer: "Universitas Gadjah Mada (UGM)",
    description: "Sertifikat peserta kompetisi keamanan siber NETCOMP 4.0 Universitas Gadjah Mada (Tim: Kata ketua nama tim nya bebas).",
    issueDate: "2026-04-05",
  },
  "1QeLlW47sc4q-y3io-w0loyheWmIKbAwl": {
    title: "Lomba Waskita Manunggal Siber TA 2026",
    issuer: "Pussiberad (Pusat Siber TNI AD)",
    description: "Sertifikat peserta Lomba Waskita Manunggal Siber TA 2026 di Pussiberad Jakarta.",
    issueDate: "2026-04-20",
  },
  "1H_oRcDN2g_dqqXOOHzPiD2WXeFOYcyZk": {
    title: "Capture The Flag COMPFEST 17",
    issuer: "Fasilkom Universitas Indonesia (UI)",
    description: "Sertifikat peserta kompetisi Capture The Flag (CTF) COMPFEST 17 Universitas Indonesia.",
    issueDate: "2025-12-30",
  },
  "1iXq9qWKq0cy1ZejaSGvylb60a_N3G4IA": {
    title: "National IT Competition Web Design - INVOFEST 2025",
    issuer: "HMPTI Universitas Harkat Negeri Tegal",
    description: "Sertifikat peserta National IT Competition Web Design Kategori SMA/SMK/MA pada Informatics Vocational Festival 2025.",
    issueDate: "2025-11-27",
    credentialId: "503.25/HMPTI.KMUHN/XI/2025",
  },
  "1ml5DVWVJWeyr7U8kxbymVqUIO0XU5Xf3": {
    title: "Jatim Cybersecurity Competition 2025",
    issuer: "Diskominfo Provinsi Jawa Timur",
    description: "Sertifikat resmi peserta Jatim Cybersecurity Competition (JCC) 2025 dengan tanda tangan elektronik BSrE-BSSN.",
    issueDate: "2025-10-29",
    credentialId: "000.6.4.1/1126.144/114.5/2025",
  },
  "1FlF4sK7BSPyNGhkde7iSI3VGxKBVoUZN": {
    title: "Preparation Course for Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft & ElevAite",
    description: "Sertifikat kelulusan pelatihan online persiapan ujian sertifikasi Microsoft Azure AI Fundamentals (AI-900).",
    issueDate: "2025-09-26",
    credentialId: "254fbc68",
  },
  "1CshTOrgLiUCYicqO7W1jcppevBv0N40V": {
    title: "HackPoint Starter Red Team Bootcamp",
    issuer: "HackPoint (Izudin AlGhozi)",
    description: "Sertifikat kelulusan 7-day intensive bootcamp HackPoint (Web Application Security, OWASP Top 10, Pentest Workflow, CTF Challenge).",
    issueDate: "2025-07-12",
    credentialId: "HP-BOOTCAMP-2025-003",
  },
  "1woO5fdvsblwbpp7UZ2eVQuTGU_UAyr6w": {
    title: "HackPoint Red Team Bootcamp 1",
    issuer: "HackPoint (Izudin AlGhozi)",
    description: "Sertifikat pelatihan intensif Red Team Bootcamp 1 mencakup Cybersecurity Fundamentals & Penetration Testing.",
    issueDate: "2025-07-12",
    credentialId: "HP-BOOTCAMP-2025-003",
  },
};

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
  const verifiedFact = FACTUAL_METADATA_MAP[file.id] || {};

  const category = properties.category || filenameMetadata.category || directories[0] || "Sertifikat";
  let defaultIssuer = properties.issuer || filenameMetadata.issuer || directories.at(-1) || "Penerbit tidak dicantumkan";
  let mappedCategories = directories.map((dir) => (dir === "webdev" ? "software engineer" : dir));
  if (defaultIssuer === "webdev") {
    defaultIssuer = "software engineer";
  }

  return {
    id: file.id,
    driveFileId: file.id,
    title: verifiedFact.title || properties.title || filenameMetadata.title || titleFromFilename(file.name),
    issuer: verifiedFact.issuer || defaultIssuer,
    description: verifiedFact.description || properties.description || file.description || "",
    category,
    categories: mappedCategories.length > 0 ? mappedCategories : [category],
    issueDate: verifiedFact.issueDate || properties.issueDate || filenameMetadata.issueDate || file.createdTime?.slice(0, 10) || "",
    credentialId: verifiedFact.credentialId || properties.credentialId || filenameMetadata.credentialId || "",
    credentialUrl: verifiedFact.credentialUrl || "",
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    mimeType: file.mimeType,
    thumbnailLink: file.thumbnailLink || "",
    fileName: file.name,
    modifiedTime: file.modifiedTime || "",
    featured: Boolean(verifiedFact.featured || properties.featured),
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
    if (first.featured && !second.featured) return -1;
    if (!first.featured && second.featured) return 1;
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
