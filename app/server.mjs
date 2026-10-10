import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseWithGemini } from './ai.mjs';

const root = dirname(fileURLToPath(import.meta.url));
if (existsSync(resolve(root, '.env.local'))) process.loadEnvFile(resolve(root, '.env.local'));
const staticDir = resolve(root, 'dist');
const dataDir = resolve(root, 'data');
await mkdir(dataDir, { recursive: true });
const db = new DatabaseSync(process.env.ANIRO_DATABASE_PATH || join(dataDir, 'aniro.sqlite'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL DEFAULT 0,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`);

const port = Number(process.env.ANIRO_PORT || 4174);
const host = process.env.ANIRO_HOST || '127.0.0.1';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const failures = new Map();
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json', '.json':'application/json; charset=utf-8' };

function json(res, status, body, extra = {}) {
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', ...extra });
  res.end(JSON.stringify(body));
}
function bad(res, status, message) { json(res, status, { error:message }); }
function hashPassword(password, salt) { return scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex'); }
function verifyPassword(password, user) {
  const expected = Buffer.from(user.password_hash, 'hex');
  const actual = Buffer.from(hashPassword(password, user.password_salt), 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function cookieToken(req) {
  const entry = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('aniro_session='));
  return entry?.slice('aniro_session='.length) || '';
}
function sessionFor(req) {
  const token = cookieToken(req);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const row = db.prepare(`SELECT s.token_hash, s.expires_at, u.id, u.username, u.display_name
    FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`).get(tokenHash);
  if (!row || row.expires_at <= Date.now()) return null;
  return row;
}
function setSession(res, userId, req) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(tokenHash, userId, Date.now()+SESSION_MS, new Date().toISOString());
  const secure = req.socket.encrypted ? '; Secure' : '';
  return `aniro_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(SESSION_MS/1000)}${secure}`;
}
function clearSession(req) { const token = cookieToken(req); if (/^[a-f0-9]{64}$/.test(token)) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(createHash('sha256').update(token).digest('hex')); }
async function bodyJson(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 2_000_000) throw new Error('Request is too large');
  }
  try { return JSON.parse(text || '{}'); } catch { throw new Error('Invalid JSON'); }
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try { const url = new URL(origin); return url.host === req.headers.host && ['http:','https:'].includes(url.protocol); } catch { return false; }
}
function clientKey(req, username='') { return `${req.socket.remoteAddress}:${username}`; }
function blocked(key) { const record=failures.get(key); return !!record && record.until > Date.now() && record.count >= 5; }
function failed(key) { const prior=failures.get(key); const recent=prior?.until>Date.now()?prior:{count:0,until:Date.now()+15*60_000}; recent.count++; failures.set(key,recent); }
function validState(s) {
  if (!s || s.version !== 1 || typeof s.settings !== 'object') return false;
  return ['modules','assignments','sessions','transactions','health','habits','checkins','messages','plans','audit'].every(k=>Array.isArray(s[k]));
}
const initialState = () => ({ version:1, draftText:'', settings:{ name:'there', budget:15000, calendarClientId:'', calendarId:'primary', lowEnergy:false }, modules:[], assignments:[], sessions:[], transactions:[], health:[], habits:[], checkins:[], messages:[], plans:[], audit:[] });

async function api(req, res, pathname) {
  if (!['GET','POST','PUT'].includes(req.method)) return bad(res,405,'Method not allowed');
  if (req.method !== 'GET' && !sameOrigin(req)) return bad(res,403,'Invalid request origin');
  const session = sessionFor(req);
  if (pathname === '/api/session' && req.method === 'GET') {
    return json(res,200,{ authenticated:!!session, registrationOpen:!db.prepare('SELECT 1 FROM users LIMIT 1').get(), user:session?{username:session.username,displayName:session.display_name}:null });
  }
  if (pathname === '/api/register' && req.method === 'POST') {
    if (db.prepare('SELECT 1 FROM users LIMIT 1').get()) return bad(res,403,'Registration is closed for this personal app');
    const data = await bodyJson(req);
    const username = String(data.username||'').trim().toLowerCase();
    const displayName = String(data.displayName||'').trim().slice(0,60) || username;
    const password = String(data.password||'');
    if (!/^[a-z0-9._-]{3,64}$/.test(username)) return bad(res,400,'Username must be 3–64 letters, numbers, dots, dashes, or underscores');
    if (password.length < 12 || password.length > 256) return bad(res,400,'Use a password of 12–256 characters');
    const userId = randomBytes(16).toString('hex'), salt=randomBytes(24).toString('hex');
    const state = initialState(); state.settings.name=displayName;
    db.exec('BEGIN IMMEDIATE');
    try {
      if (db.prepare('SELECT 1 FROM users LIMIT 1').get()) { db.exec('ROLLBACK'); return bad(res,403,'Registration is closed'); }
      db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)').run(userId,username,displayName,salt,hashPassword(password,salt),new Date().toISOString());
      db.prepare('INSERT INTO user_data VALUES (?, 0, ?, ?)').run(userId,JSON.stringify(state),new Date().toISOString());
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    return json(res,201,{ user:{username,displayName} },{'Set-Cookie':setSession(res,userId,req)});
  }
  if (pathname === '/api/login' && req.method === 'POST') {
    const data=await bodyJson(req), username=String(data.username||'').trim().toLowerCase(),password=String(data.password||'');
    const key=clientKey(req,username);
    if (blocked(key)) return bad(res,429,'Too many attempts. Try again in 15 minutes.');
    const user=db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !verifyPassword(password,user)) { failed(key); return bad(res,401,'Username or password is incorrect'); }
    failures.delete(key);
    return json(res,200,{ user:{username:user.username,displayName:user.display_name} },{'Set-Cookie':setSession(res,user.id,req)});
  }
  if (!session) return bad(res,401,'Sign in to continue');
  if (pathname === '/api/logout' && req.method === 'POST') {
    clearSession(req);
    return json(res,200,{ok:true},{'Set-Cookie':'aniro_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});
  }
  if (pathname === '/api/password' && req.method === 'POST') {
    const data=await bodyJson(req),current=String(data.currentPassword||''),next=String(data.newPassword||'');
    const user=db.prepare('SELECT * FROM users WHERE id = ?').get(session.id);
    if (!verifyPassword(current,user)) return bad(res,401,'Current password is incorrect');
    if (next.length<12 || next.length>256) return bad(res,400,'Use a password of 12–256 characters');
    const salt=randomBytes(24).toString('hex');
    db.prepare('UPDATE users SET password_salt = ?, password_hash = ? WHERE id = ?').run(salt,hashPassword(next,salt),session.id);
    db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').run(session.id,session.token_hash);
    return json(res,200,{ok:true});
  }
  if (pathname === '/api/state' && req.method === 'GET') {
    const row=db.prepare('SELECT revision, data_json FROM user_data WHERE user_id = ?').get(session.id);
    return json(res,200,{revision:row.revision,state:JSON.parse(row.data_json)});
  }
  if (pathname === '/api/ai/status' && req.method === 'GET') {
    return json(res,200,{configured:!!process.env.GEMINI_API_KEY});
  }
  if (pathname === '/api/ai/parse' && req.method === 'POST') {
    if (!process.env.GEMINI_API_KEY) return bad(res,503,'AI is not configured. Use local review or add a Gemini API key on the server.');
    const data=await bodyJson(req);
    const text=typeof data.text==='string'?data.text.trim():'';
    const today=typeof data.today==='string' && /^\d{4}-\d{2}-\d{2}$/.test(data.today)?data.today:new Date().toISOString().slice(0,10);
    if (!text || text.length>5000) return bad(res,400,'Write 1–5000 characters to review');
    const row=db.prepare('SELECT data_json FROM user_data WHERE user_id = ?').get(session.id);
    const modules=JSON.parse(row.data_json).modules||[];
    try { return json(res,200,{proposals:await parseWithGemini({text,today,modules,key:process.env.GEMINI_API_KEY})}); }
    catch (error) { return bad(res,502,error.message); }
  }
  if (pathname === '/api/state' && req.method === 'PUT') {
    const data=await bodyJson(req);
    if (!Number.isInteger(data.revision) || !validState(data.state)) return bad(res,400,'Invalid app data');
    const result=db.prepare('UPDATE user_data SET revision = revision + 1, data_json = ?, updated_at = ? WHERE user_id = ? AND revision = ?').run(JSON.stringify(data.state),new Date().toISOString(),session.id,data.revision);
    if (!result.changes) return bad(res,409,'This account changed elsewhere. Reload before making more changes.');
    const displayName=String(data.state.settings.name||'').trim().slice(0,60);
    if (displayName) db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(displayName,session.id);
    return json(res,200,{revision:data.revision+1});
  }
  return bad(res,404,'Not found');
}

const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`).pathname;
  try {
    if (pathname.startsWith('/api/')) return await api(req,res,pathname);
    if (req.method!=='GET' && req.method!=='HEAD') return bad(res,405,'Method not allowed');
    const file=resolve(staticDir,`.${decodeURIComponent(pathname==='/'?'/index.html':pathname)}`);
    if (file!==staticDir && !file.startsWith(staticDir+sep)) return bad(res,403,'Forbidden');
    if (!existsSync(file)) return bad(res,404,'Not found');
    const bytes=await readFile(file);
    res.writeHead(200,{ 'Content-Type':mime[extname(file)]||'application/octet-stream', 'Content-Length':bytes.length, 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-cache' });
    res.end(req.method==='HEAD'?undefined:bytes);
  } catch(error) { console.error(error); if (!res.headersSent) bad(res,error.message==='Request is too large'?413:500,error.message==='Invalid JSON'||error.message==='Request is too large'?error.message:'Server error'); }
});
server.listen(port,host,()=>console.log(`Aniro full stack server: http://${host}:${server.address().port}`));
process.on('SIGINT',()=>{server.close();db.close();process.exit(0)});
