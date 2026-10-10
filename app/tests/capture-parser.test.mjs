import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCapture, parseDate } from '../dist/capture-parser.mjs';
import { normalizeSuggestions, parseWithGemini } from '../ai.mjs';

const now = new Date(2026,9,10);

test('the reported six-exam note becomes six dated review proposals', () => {
  const text = 'I have an exam on Nov 1st, I actually six exams on the same date Computer systems, ICT , Fundamentals of programming, Web design ,maths and communication';
  const proposals = parseCapture(text,[],now);
  assert.equal(proposals.length,6);
  assert.deepEqual(proposals.map(p=>p.title),['Computer systems exam','ICT exam','Fundamentals of programming exam','Web design exam','maths exam','communication exam']);
  assert.ok(proposals.every(p=>p.due==='2026-11-01' && p.kind==='Exam'));
});

test('month dates roll forward and invalid dates are rejected', () => {
  assert.equal(parseDate('Nov 1st',now),'2026-11-01');
  assert.equal(parseDate('March 3',now),'2027-03-03');
  assert.equal(parseDate('31 February',now),null);
  assert.equal(parseDate('2026-02-31',now),null);
});

test('regular capture still extracts expense, study time and a deadline', () => {
  const proposals=parseCapture('I studied networking for 45 minutes, spent Rs 200 on lunch, and my database assignment is due Friday',[],now);
  assert.deepEqual(proposals.map(p=>p.type),['transaction','session','assignment']);
  assert.equal(proposals[0].amount,200);
  assert.equal(proposals[1].minutes,45);
  assert.equal(proposals[2].due,'2026-10-16');
});

test('AI results are validated before reaching review', () => {
  const result=normalizeSuggestions([{type:'assignment',title:'ICT exam',due:'2026-11-01',kind:'Exam',moduleName:'ICT'}, {type:'transaction',amount:-1}, {type:'assignment',title:'Bad',due:'2026-02-31'}],[{id:'ict',name:'ICT'}],'2026-10-10');
  assert.equal(result.length,2);
  assert.equal(result[0].moduleId,'ict');
  assert.equal(result[1].due,'');
});

test('AI request keeps the key in the server request header and returns reviewed items', async () => {
  let called;
  const proposals=await parseWithGemini({text:'ICT exam Nov 1st',today:'2026-10-10',modules:[],key:'test-secret',fetchImpl:async(url,options)=>{
    called={url,options};
    return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({suggestions:[{type:'assignment',source:'ICT exam Nov 1st',title:'ICT exam',due:'2026-11-01',kind:'Exam'}]})}]}}]})};
  }});
  assert.equal(called.options.headers['x-goog-api-key'],'test-secret');
  assert.ok(!called.url.includes('test-secret'));
  assert.equal(proposals[0].title,'ICT exam');
});
