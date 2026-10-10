const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const atNoon = date => new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);

export function habitCalendar(checkins, habitId, now = new Date(), weeks = 13) {
  const current = atNoon(now);
  const start = atNoon(now);
  start.setDate(start.getDate() - start.getDay() - (weeks-1)*7);
  const active = new Set(checkins.filter(item=>item.habitId===habitId).map(item=>item.date));
  return Array.from({length:weeks*7},(_,index)=>{
    const day=atNoon(start);
    day.setDate(day.getDate()+index);
    const date=iso(day);
    return {date,active:active.has(date),future:day>current,today:date===iso(current)};
  });
}

export function habitStats(checkins, habitId, now = new Date()) {
  const active=new Set(checkins.filter(item=>item.habitId===habitId).map(item=>item.date));
  const day=atNoon(now);
  let last7=0;
  for(let index=0;index<7;index++){
    if(active.has(iso(day)))last7++;
    day.setDate(day.getDate()-1);
  }
  const runDay=atNoon(now);
  if(!active.has(iso(runDay)))runDay.setDate(runDay.getDate()-1);
  let run=0;
  while(active.has(iso(runDay)) && run<366){run++;runDay.setDate(runDay.getDate()-1)}
  return {last7,run};
}
