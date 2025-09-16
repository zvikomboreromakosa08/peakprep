// Inactivity reminders via Notifications API (user permission required)
const INACTIVE_MS = 1000 * 60 * 15; // 15 minutes
let timer;

function notify(){
  if (Notification.permission !== 'granted') return;
  new Notification('Ready to continue?', { body: 'Pick up where you left off on PeakPrep.', icon:'/assets/img/logo.svg' });
}

function reset(){
  if (timer) clearTimeout(timer);
  timer = setTimeout(notify, INACTIVE_MS);
}

export async function initNotifications(){
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default'){
    // Show a gentle CTA button in UI to request permission instead of auto-prompting
    const btn = document.querySelector('#enable-reminders');
    if (btn) btn.addEventListener('click', async ()=>{
      const perm = await Notification.requestPermission();
      if (perm === 'granted'){ navigator.serviceWorker?.ready.then(()=> notify()); }
    });
  }
  ['click','keydown','mousemove','scroll','touchstart'].forEach(evt=> window.addEventListener(evt, reset, {passive:true}));
  reset();
}
