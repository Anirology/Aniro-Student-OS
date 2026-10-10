import test from 'node:test';
import assert from 'node:assert/strict';
import { habitCalendar, habitStats } from '../dist/habits.mjs';

const now = new Date(2026,9,10);
const entries = [
  {habitId:'reading',date:'2026-10-10'},
  {habitId:'reading',date:'2026-10-09'},
  {habitId:'reading',date:'2026-10-08'},
  {habitId:'water',date:'2026-10-10'}
];

test('activity map covers 13 complete weeks and marks the selected habit',()=>{
  const days=habitCalendar(entries,'reading',now);
  assert.equal(days.length,91);
  assert.equal(days[0].date,'2026-07-12');
  assert.equal(days.filter(day=>day.active).length,3);
  assert.equal(days.find(day=>day.date==='2026-10-10').today,true);
  assert.equal(days.at(-1).future,false);
  assert.equal(habitCalendar(entries,'reading',new Date(2026,9,8)).at(-1).future,true);
});

test('consistency and run count only the selected habit',()=>{
  assert.deepEqual(habitStats(entries,'reading',now),{last7:3,run:3});
  assert.deepEqual(habitStats(entries,'water',now),{last7:1,run:1});
  assert.deepEqual(habitStats([], 'reading',now),{last7:0,run:0});
});

test('a run through yesterday remains visible before today is checked',()=>{
  assert.deepEqual(habitStats(entries.filter(e=>e.date!=='2026-10-10'),'reading',now),{last7:2,run:2});
});
