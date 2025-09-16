export function trackVisit({level, subject, topic, type}){
  try {
    const key = 'pp:activity';
    const act = JSON.parse(localStorage.getItem(key) || '[]');
    act.unshift({level, subject, topic, type, ts: Date.now()});
    localStorage.setItem(key, JSON.stringify(act.slice(0,50)));
  } catch {}
}

export function getRecommendations(){
  try {
    const act = JSON.parse(localStorage.getItem('pp:activity') || '[]');
    if (!act.length) return [];
    // Simple heuristic: top (subject, type) combos recently used
    const score = new Map();
    for (const a of act){
      const k = `${a.level}|${a.subject}|${a.type}`;
      score.set(k, (score.get(k)||0) + 1 + Math.max(0, 3 - (Date.now()-a.ts)/(1000*60*60*24)));
    }
    const sorted = [...score.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
    return sorted.map(([k])=>{
      const [level, subject, type] = k.split('|');
      return { level, subject, type, label: `${subject} — ${type.toUpperCase()}`, href: `/subject.html?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subject)}#${type}` };
    });
  } catch { return []; }
}
