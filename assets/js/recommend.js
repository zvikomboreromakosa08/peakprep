export function trackVisit({level, subject, topic, type}){
  try {
    const key = 'pp:activity';
    const act = JSON.parse(localStorage.getItem(key) || '[]');
    act.unshift({level, subject, topic, type, ts: Date.now()});
    localStorage.setItem(key, JSON.stringify(act.slice(0,50)));
  } catch {}
}

// New version: async function to fetch topics.json dynamically
export async function getRecommendations(){
  try {
    // Fetch the topics JSON
    const response = await fetch('/data/topics.json'); // adjust path if needed
    const topicsData = await response.json();

    // Read recent activity
    const act = JSON.parse(localStorage.getItem('pp:activity') || '[]');

    const recommendations = [];

    // If no activity, just show top 3 topics from each subject
    if (!act.length) {
      for (const subject in topicsData) {
        const examCodes = Object.keys(topicsData[subject]);
        const topics = topicsData[subject][examCodes[0]]; // pick first exam code
        topics.slice(0,3).forEach(topic => {
          recommendations.push({
            level: 'IGCSE',
            subject,
            type: topic,
            label: `${subject}: ${topic}`,
            href: `/levels/igcse.html#${topic.replace(/\s+/g,'-')}`
          });
        });
      }
      return recommendations.slice(0, 6); // limit to 6 recommendations
    }

    // Otherwise, use the old scoring heuristic based on activity
    const score = new Map();
    for (const a of act){
      const k = `${a.level}|${a.subject}|${a.type}`;
      score.set(k, (score.get(k)||0) + 1 + Math.max(0, 3 - (Date.now()-a.ts)/(1000*60*60*24)));
    }
    const sorted = [...score.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
    for (const [k] of sorted){
      const [level, subject, type] = k.split('|');
      recommendations.push({
        level,
        subject,
        type,
        label: `${subject}: ${type}`,
        href: `/subject.html?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subject)}#${type.replace(/\s+/g,'-')}`
      });
    }

    return recommendations;

  } catch (err) {
    console.error('Error in getRecommendations:', err);
    return [];
  }
}
