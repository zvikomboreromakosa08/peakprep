// Read URL query parameters
export function qs(name, fallback=null){
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? fallback;
}
export function go(url, params={}){
  const q = new URLSearchParams(params);
  window.location.href = `${url}?${q.toString()}`;
}
