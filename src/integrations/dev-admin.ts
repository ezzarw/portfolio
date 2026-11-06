import type { AstroIntegration } from 'astro';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export function devAdminPlugin(): AstroIntegration {
  return {
    name: 'dev-admin-plugin',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // Hapus folder /admin dari hasil build output production agar benar-benar 404 (tidak ada file admin sama sekali)
        const adminDist = path.join(dir.pathname.replace(/^\/([a-zA-Z]:)/, '$1'), 'admin');
        try {
          await fs.rm(adminDist, { recursive: true, force: true });
        } catch (e) {
          // ignore
        }
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/api/dev/projects', async (req, res, next) => {
          const dataFile = path.resolve(process.cwd(), 'src/data/projects.json');
          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(dataFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(bodyStr);
                if (!Array.isArray(parsed)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Payload must be an array' }));
                  return;
                }
                await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: parsed.length }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        });

        server.middlewares.use('/api/dev/skills', async (req, res, next) => {
          const dataFile = path.resolve(process.cwd(), 'src/data/skills.json');
          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(dataFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(bodyStr);
                if (!Array.isArray(parsed)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Payload must be an array of skill groups' }));
                  return;
                }
                await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: parsed.length }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        });

        server.middlewares.use('/api/dev/jobs', async (req, res, next) => {
          const dataFile = path.resolve(process.cwd(), 'src/data/jobs.json');
          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(dataFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(bodyStr);
                if (!Array.isArray(parsed)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Payload must be an array of jobs' }));
                  return;
                }
                await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: parsed.length }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        });

        server.middlewares.use('/api/dev/education', async (req, res, next) => {
          const dataFile = path.resolve(process.cwd(), 'src/data/education.json');
          if (req.method === 'GET') {
            try {
              const data = await fs.readFile(dataFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(bodyStr);
                if (!Array.isArray(parsed)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Payload must be an array of objects' }));
                  return;
                }
                await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: parsed.length }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        });

        server.middlewares.use('/api/dev/upload', async (req, res, next) => {
          if (req.method === 'POST') {
            const uploadDir = path.resolve(process.cwd(), 'public/projects');
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const fullBuffer = Buffer.concat(chunks);
                const json = JSON.parse(fullBuffer.toString('utf-8'));
                const rawName = json.filename || json.fileName;
                const rawData = json.data || json.fileData;
                if (!rawName || !rawData) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'filename and data (base64) are required' }));
                  return;
                }
                const base64Clean = rawData.replace(/^data:image\/[\w+.-]+;base64,/, '');
                const fileBuffer = Buffer.from(base64Clean, 'base64');
                const cleanSlug = rawName.replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
                const targetFile = path.join(uploadDir, `${cleanSlug}.webp`);
                const tmpInput = path.join(uploadDir, `_tmp_${Date.now()}_${cleanSlug}`);
                await fs.mkdir(uploadDir, { recursive: true });
                await fs.writeFile(tmpInput, fileBuffer);

                try {
                  const { execFile } = await import('node:child_process');
                  const { promisify } = await import('node:util');
                  const execFileAsync = promisify(execFile);
                  await execFileAsync('magick', [
                    tmpInput,
                    '-resize', '1200x900>',
                    '-quality', '88',
                    targetFile
                  ]);
                } catch (_) {
                  await fs.writeFile(targetFile, fileBuffer);
                } finally {
                  try { await fs.rm(tmpInput, { force: true }); } catch (_) {}
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, slug: cleanSlug, path: `/projects/${cleanSlug}.webp` }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });

        server.middlewares.use('/api/dev/upload-icon', async (req, res, next) => {
          if (req.method === 'POST') {
            const iconDir = path.resolve(process.cwd(), 'public/techstack');
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const fullBuffer = Buffer.concat(chunks);
                const json = JSON.parse(fullBuffer.toString('utf-8'));
                if (!json.filename || !json.data) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'filename and data (base64) are required' }));
                  return;
                }

                const removeBg = json.removeBg === true;
                const base64Clean = json.data.replace(/^data:image\/\w+;base64,/, '');
                let rawBuffer = Buffer.from(base64Clean, 'base64');
                const cleanSlug = json.filename.replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

                await fs.mkdir(iconDir, { recursive: true });
                const tmpInput = path.join(iconDir, `_tmp_in_${Date.now()}_${cleanSlug}.png`);
                const tmpNoBg = path.join(iconDir, `_tmp_nobg_${Date.now()}_${cleanSlug}.png`);
                const finalWebp = path.join(iconDir, `${cleanSlug}.webp`);

                await fs.writeFile(tmpInput, rawBuffer);

                // Jika user meminta remove background via API remove.bg
                if (removeBg) {
                  try {
                    const { execFile } = await import('node:child_process');
                    const { promisify } = await import('node:util');
                    const execFileAsync = promisify(execFile);
                    const apiKey = json.apiKey || 'jvk2kYenwfvFN1XM7aSFXDFy';

                    await execFileAsync('curl', [
                      '-s',
                      '-H', `X-API-Key: ${apiKey}`,
                      '-F', `image_file=@${tmpInput}`,
                      '-F', 'size=auto',
                      '-f', 'https://api.remove.bg/v1.0/removebg',
                      '-o', tmpNoBg
                    ]);
                    // Jika berhasil, gunakan hasil remove.bg
                    await fs.access(tmpNoBg);
                    await execFileAsync('magick', [
                      tmpNoBg,
                      '-resize', '128x128>',
                      '-quality', '90',
                      finalWebp
                    ]);
                  } catch (apiErr) {
                    // Fallback jika API gagal/kuota habis: resize langsung
                    const { execFile } = await import('node:child_process');
                    const { promisify } = await import('node:util');
                    const execFileAsync = promisify(execFile);
                    await execFileAsync('magick', [
                      tmpInput,
                      '-resize', '128x128>',
                      '-quality', '90',
                      finalWebp
                    ]);
                  }
                } else {
                  const { execFile } = await import('node:child_process');
                  const { promisify } = await import('node:util');
                  const execFileAsync = promisify(execFile);
                  await execFileAsync('magick', [
                    tmpInput,
                    '-resize', '128x128>',
                    '-quality', '90',
                    finalWebp
                  ]);
                }

                // Cleanup temporary files
                try { await fs.rm(tmpInput, { force: true }); } catch (_) {}
                try { await fs.rm(tmpNoBg, { force: true }); } catch (_) {}

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, slug: cleanSlug }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });
        server.middlewares.use('/api/dev/upload-logo', async (req, res, next) => {
          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const fullBuffer = Buffer.concat(chunks);
                const json = JSON.parse(fullBuffer.toString('utf-8'));
                const rawName = json.filename || json.fileName;
                const rawData = json.data || json.fileData;
                if (!rawName || !rawData) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'filename and data (base64) are required' }));
                  return;
                }
                const folder = json.folder === 'education' ? 'education' : 'logos';
                const logoDir = path.resolve(process.cwd(), `public/assets/${folder}`);
                const base64Clean = rawData.replace(/^data:image\/[\w+.-]+;base64,/, '');
                const fileBuffer = Buffer.from(base64Clean, 'base64');
                const cleanSlug = rawName.replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
                const targetFile = path.join(logoDir, `${cleanSlug}.webp`);
                const tmpInput = path.join(logoDir, `_tmp_${Date.now()}_${cleanSlug}`);
                await fs.mkdir(logoDir, { recursive: true });
                await fs.writeFile(tmpInput, fileBuffer);

                try {
                  const { execFile } = await import('node:child_process');
                  const { promisify } = await import('node:util');
                  const execFileAsync = promisify(execFile);
                  await execFileAsync('magick', [
                    tmpInput,
                    '-resize', '256x256>',
                    '-quality', '90',
                    targetFile
                  ]);
                } catch (_) {
                  await fs.writeFile(targetFile, fileBuffer);
                } finally {
                  try { await fs.rm(tmpInput, { force: true }); } catch (_) {}
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, path: `/assets/${folder}/${cleanSlug}.webp`, slug: cleanSlug }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });
      },
    },
  };
}
