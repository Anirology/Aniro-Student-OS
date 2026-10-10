const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const monthPattern = '(january|february|march|april|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)';
const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const moduleFor = (text, modules) => modules.find(m => text.toLowerCase().includes(m.name.toLowerCase()) || (m.code && text.toLowerCase().includes(m.code.toLowerCase())))?.id || '';

export function parseDate(text, now = new Date()) {
  const lower = text.toLowerCase();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  if (/\btomorrow\b/.test(lower)) { base.setDate(base.getDate()+1); return iso(base); }
  if (/\btoday\b/.test(lower)) return iso(base);
  const named = lower.match(new RegExp(`\\b${monthPattern}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b`, 'i'));
  const reversed = lower.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${monthPattern}\\.?(?:,?\\s+(\\d{4}))?\\b`, 'i'));
  if (named || reversed) {
    const monthText = named ? named[1] : reversed[2];
    const month = months.findIndex(m => m.startsWith(monthText.slice(0,3)));
    const day = Number(named ? named[2] : reversed[1]);
    let year = Number((named ? named[3] : reversed[3]) || base.getFullYear());
    if (month < 0 || day < 1 || day > 31) return null;
    let date = new Date(year, month, day, 12);
    if (date.getMonth() !== month) return null;
    if (!(named ? named[3] : reversed[3]) && date < base) date = new Date(year+1, month, day, 12);
    return iso(date);
  }
  const numeric = lower.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (numeric) {
    const date = new Date(Number(numeric[1]), Number(numeric[2])-1, Number(numeric[3]), 12);
    return iso(date) === numeric[0] ? numeric[0] : null;
  }
  const weekday = lower.match(/\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
  if (weekday) {
    let difference = (weekdays.indexOf(weekday[2])-base.getDay()+7)%7;
    if (weekday[1]) difference += difference === 0 ? 7 : 7;
    base.setDate(base.getDate()+difference);
    return iso(base);
  }
  return null;
}

function categoryFor(text) {
  const t = text.toLowerCase();
  if (/lunch|dinner|breakfast|coffee|tea|snack|food|meal/.test(t)) return 'Food';
  if (/bus|train|uber|taxi|fuel|travel/.test(t)) return 'Transport';
  if (/book|course|tuition|education/.test(t)) return 'Education';
  if (/doctor|medicine|pharmacy|health/.test(t)) return 'Health';
  if (/netflix|spotify|subscription/.test(t)) return 'Subscriptions';
  if (/movie|game|entertainment/.test(t)) return 'Entertainment';
  return 'Other';
}

function examSubjects(text) {
  const count = text.match(/\b(\d+|two|three|four|five|six|seven|eight|nine|ten)\s+exams?\b/i);
  if (!count) return [];
  const rest = text.slice(count.index + count[0].length);
  const afterDate = rest.replace(/^.*?\b(?:same\s+date|same\s+day|on|due|by)\b/i, '')
    .replace(/^\s*(?:the\s+)?same\s+(?:date|day)\b/i, '')
    .replace(new RegExp(`^\\s*(?:the\\s+)?(?:same\\s+date\\s+)?(?:${monthPattern}\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s+\\d{4})?|\\d{4}-\\d{2}-\\d{2})`, 'i'), '')
    .replace(/^\s*[:;,–—-]?\s*/, '').replace(/[.!?]+$/, '');
  const subjects = afterDate.split(/\s*,\s*|\s+and\s+/i).map(s => s.trim().replace(/^(?:for|in|of)\s+/i,'').replace(/[.!?]+$/,'')).filter(s => s.length >= 2 && s.length <= 70 && !/^(?:the|same|date|day)$/i.test(s));
  const expected = /^\d+$/.test(count[1]) ? Number(count[1]) : {two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10}[count[1].toLowerCase()];
  return subjects.length >= 2 && subjects.length <= 12 && subjects.length === expected ? subjects : [];
}

export function parseCapture(text, modules = [], now = new Date()) {
  const proposals = [];
  const date = iso(now);
  const amount = text.match(/(?:Rs\.?|LKR|rupees?)\s*([\d,]+(?:\.\d{1,2})?)/i) || text.match(/([\d,]+(?:\.\d{1,2})?)\s*(?:rupees?|LKR)/i);
  if (amount) proposals.push({id:id(),type:'transaction',source:amount[0],amount:Number(amount[1].replaceAll(',','')),category:categoryFor(text),note:text.slice(0,80),date,transactionType:/\b(earned|received|income|salary|paid me)\b/i.test(text)?'income':'expense',confidence:'high'});
  const study = text.match(/\b(?:studied|study|revised|reviewed|practiced|worked on)\b[^.!?]*?\b(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\b/i) || text.match(/\b(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\s+(?:of\s+)?(?:study|revision|practice)\b/i);
  if (study) proposals.push({id:id(),type:'session',source:study[0],minutes:/hour|hr/i.test(study[2])?Math.round(Number(study[1])*60):Math.round(Number(study[1])),moduleId:moduleFor(study[0],modules),date,confidence:moduleFor(study[0],modules)?'high':'medium'});
  const due = parseDate(text,now) || '';
  const subjects = examSubjects(text);
  if (subjects.length) {
    for (const subject of subjects) proposals.push({id:id(),type:'assignment',source:subject,title:`${subject} exam`,due,moduleId:moduleFor(subject,modules),kind:'Exam',confidence:due?'medium':'low'});
  } else {
    const task = text.match(/\b([\w\s-]{3,65}?(?:assignment|exam|quiz|project|submission|report|presentation|test))\b[^.!?]*?\b(?:due|on|by)\b\s*([^.!?]+)/i) || text.match(/\b(?:assignment|exam|quiz|project|report)\b[^.!?]{0,70}/i);
    if (task) proposals.push({id:id(),type:'assignment',source:task[0],title:(task[1]?.trim()||task[0].trim()).replace(/^(?:and\s+)?(?:my\s+)?/i,''),due,moduleId:moduleFor(task[0],modules),kind:/exam|quiz|test/i.test(task[0])?'Exam':'Assignment',confidence:due?'medium':'low'});
  }
  const health = text.match(/\b(?:slept|sleep)\s+(\d+(?:\.\d+)?)\s*(hours?|hrs?)\b/i);
  if (health) proposals.push({id:id(),type:'health',source:health[0],kind:'Sleep',value:`${health[1]} hours`,note:'',date,confidence:'high'});
  return proposals;
}
