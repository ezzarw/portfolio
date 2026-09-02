const fs = require('fs');
const path = require('path');
const https = require('https');

const NOTES_DATA_PATH = path.join(__dirname, '../src/data/NotesData.json');
const PUBLIC_NOTION_PAGE_ID = "3cf52d1a-44ad-80ff-b356-df6e7a9c6794";
const PUBLIC_NOTION_URL = "https://five-gray-199.notion.site/3cf52d1a44ad80ffb356df6e7a9c6794?v=5ad52d1a44ad8219bba18828789d6e28";

function postNotionPublic(endpoint, body) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const options = {
      method: 'POST',
      hostname: 'www.notion.so',
      path: `/api/v3/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({});
        }
      });
    });

    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function syncPublicNotes() {
  try {
    const pageData = await postNotionPublic('loadPageChunk', {
      pageId: PUBLIC_NOTION_PAGE_ID,
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false
    });

    const blocks = pageData?.recordMap?.block || {};
    const notes = [];

    for (const [id, bObj] of Object.entries(blocks)) {
      const val = bObj?.value || {};
      if (val.type === 'page' && val.properties?.title) {
        const title = val.properties.title.map(t => t[0]).join('').trim();
        if (title && id !== PUBLIC_NOTION_PAGE_ID.replace(/-/g, '')) {
          notes.push({
            id,
            title,
            excerpt: "Catatan publik dari Notion Workspace",
            date: new Date(val.last_edited_time || Date.now()).toISOString().slice(0, 10),
            url: `https://five-gray-199.notion.site/${id.replace(/-/g, '')}`,
            lastEdited: val.last_edited_time
          });
        }
      }
    }

    // Jika database page kosong atau belum diisi sub-page, buat fallback 1 entry hub utama
    if (notes.length === 0) {
      notes.push({
        id: PUBLIC_NOTION_PAGE_ID,
        title: "Engineering Notes & Documentation Hub",
        excerpt: "Kumpulan catatan arsitektur, DevOps playbook, K8s troubleshooting, dan security writeups.",
        date: new Date().toISOString().slice(0, 10),
        url: PUBLIC_NOTION_URL,
        lastEdited: Date.now()
      });
    }

    fs.writeFileSync(NOTES_DATA_PATH, JSON.stringify(notes, null, 2), 'utf-8');
    console.log(`Berhasil menyinkronkan ${notes.length} catatan publik Notion ke src/data/NotesData.json`);
  } catch (err) {
    console.error('Gagal sinkronisasi catatan publik Notion:', err.message);
  }
}

syncPublicNotes();
