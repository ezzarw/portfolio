/**
 * Google Apps Script Webhook Trigger
 * -----------------------------------
 * Dipasang di Google Apps Script (https://script.google.com) untuk otomatis
 * memicu GitHub Action setiap kali ada penambahan/perubahan berkas sertifikat di Drive.
 * 
 * Folder Target ID: 1VUTNa2E-4EB755a4uFERFIi5ic6K7s7D
 */

const GITHUB_REPO = "ezzarw/portfolio";
// Ganti dengan GitHub Fine-Grained Personal Access Token yang memiliki izin "Contents: Read & write" atau "Actions: Read & write"
const GITHUB_TOKEN = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN";

function triggerDriveSyncWebhook() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;
  const payload = JSON.stringify({
    event_type: "drive_update"
  });

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    },
    payload: payload,
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(`Status Webhook GitHub: ${response.getResponseCode()} - ${response.getContentText()}`);
  } catch (error) {
    Logger.log(`Gagal mengirim webhook: ${error.toString()}`);
  }
}
