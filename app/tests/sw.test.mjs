import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

test('service worker does not cache account or AI API responses',async()=>{
  const listeners={};
  const source=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');
  runInNewContext(source,{self:{addEventListener:(name,fn)=>listeners[name]=fn},URL,location:{origin:'http://127.0.0.1:4174'}});
  for(const path of ['/api/state','/api/session','/api/ai/status']){
    let intercepted=false;
    listeners.fetch({request:{method:'GET',url:`http://127.0.0.1:4174${path}`},respondWith:()=>intercepted=true});
    assert.equal(intercepted,false,path);
  }
});
