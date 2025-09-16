import { go } from './router.js';

let idx = null, recent = [];
try {
  idx = await fetch('/assets/data/index.json').then(r=>r.json());
  recent = JSON.parse(localStorage.getItem('pp:recentSearches')||'[]');
} catch {}

const input = document.querySelector('#search-input');
const list = document.querySelector('#search-suggest');

function tokenize(s){ return s.toLowerCase().split(/\s+/).filter(Boolean); }

function score(candidate, query){
  const q = tokenize(query), c = candidate.toLowerCase();
  let s = 0; q.forEach(k => { if (c.includes(k)) s += 1; if (c.startsWith(k)) s += 0.5; });
  return s;
}

function suggestions(q){
  if (!idx) return [];
  const base = idx.keywords || [];
  return base
    .map(k=>({k, s:score(k,q)}))
    .filter(o=>o.s>0 || q.length===0)
    .sort((a,b)=>b.s - a.s)
    .slice(0,8)
    .map(o=>o.k);
}

function render(listEl, items){
  listEl.innerHTML = '';
  items.forEach((k,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="sugg">${k}</button>`;
    li.querySelector('button').addEventListener('click', ()=>{
      input.value = k;
      doSearch(k);
    });
    listEl.appendChild(li);
  });
}

function doSearch(q){
  try {
    recent = [q, ...recent.filter(x=>x!==q)].slice(0,5);
    localStorage.setItem('pp:recentSearches', JSON.stringify(recent));
    localStorage.setItem('pp:lastQuery', q);
  } catch {}
  // Route to search results
  go('/search.html', { q });
}

if (input && list){
  input.addEventListener('input', ()=>{
    const q = input.value.trim();
    const items = suggestions(q);
    render(list, items);
  });
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ doSearch(input.value.trim()); }
  });
}
