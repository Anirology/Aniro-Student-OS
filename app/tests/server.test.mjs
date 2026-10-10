import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,ANIRO_DATABASE_PATH:':memory:',ANIRO_PORT:'0',ANIRO_HOST:'127.0.0.1',GEMINI_API_KEY:''},stdio:['ignore','pipe','pipe']});
let output='';
const base=await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Test server did not start')),10000);child.stdout.on('data',chunk=>{output+=chunk;const found=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(found){clearTimeout(timeout);resolve(found[0])}});child.once('exit',code=>reject(Error(`Test server exited: ${code}`)))});
let cookie='';
async function call(path,method='GET',data){const response=await fetch(base+path,{method,headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];const body=await response.json().catch(()=>({}));return {status:response.status,body}}
try{
  let response=await call('/api/session');assert.equal(response.status,200);assert.equal(response.body.registrationOpen,true);
  response=await call('/api/register','POST',{username:'testuser',displayName:'Test User',password:'a-long-test-password-123'});assert.equal(response.status,201);
  response=await call('/api/register','POST',{username:'another',password:'another-test-password-123'});assert.equal(response.status,403);
  response=await call('/api/state');assert.equal(response.status,200);assert.equal(response.body.revision,0);assert.equal(response.body.state.settings.name,'Test User');
  const saved=response.body.state;saved.modules.push({id:'module-1',name:'Networks',type:'Concept-heavy'});
  response=await call('/api/ai/status');assert.equal(response.status,200);assert.equal(response.body.configured,false);
  response=await call('/api/ai/parse','POST',{text:'ICT exam Nov 1st',today:'2026-10-10'});assert.equal(response.status,503);
  response=await call('/api/state','PUT',{revision:0,state:saved});assert.equal(response.status,200);assert.equal(response.body.revision,1);
  response=await call('/api/state','PUT',{revision:0,state:saved});assert.equal(response.status,409);
  response=await call('/api/state');assert.equal(response.body.state.modules[0].name,'Networks');
  response=await call('/api/password','POST',{currentPassword:'a-long-test-password-123',newPassword:'another-long-password-456'});assert.equal(response.status,200);
  response=await call('/api/logout','POST',{});assert.equal(response.status,200);
  response=await call('/api/state');assert.equal(response.status,401);
  response=await call('/api/login','POST',{username:'testuser',password:'a-long-test-password-123'});assert.equal(response.status,401);
  response=await call('/api/login','POST',{username:'testuser',password:'another-long-password-456'});assert.equal(response.status,200);
  response=await call('/api/state');assert.equal(response.body.state.modules[0].name,'Networks');
  console.log('PASS: registration, login, password change, SQLite save, revision conflict, and logout');
} finally {child.kill('SIGINT');await once(child,'exit').catch(()=>{})}
