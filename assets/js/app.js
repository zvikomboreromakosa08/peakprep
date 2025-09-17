// app.js

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const page = location.pathname.split("/").pop();

  if (page === "igcse.html") {
    initLibrary();
  } else if (page === "subject.html") {
    initSubjectPage();
  }
});

// ---------------- Library Page ----------------
async function initLibrary() {
  try {
    const res = await fetch("/assets/data/topics.json");
    if (!res.ok) throw new Error("Failed to load topics.json");
    const topics = await res.json();

    // Example: render subjects (can expand with your original layout)
    const container = document.querySelector(".container");
    if (!container) return;

    const list = document.createElement("ul");
    Object.keys(topics.IGCSE || {}).forEach(subject => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="/subject.html?level=IGCSE&subject=${encodeURIComponent(subject)}">${subject}</a>`;
      list.appendChild(li);
    });
    container.appendChild(list);
  } catch (err) {
    console.error(err);
  }
}

// ---------------- Subject Page ----------------
async function initSubjectPage() {
  const params = new URLSearchParams(location.search);
  const level = (params.get("level") || "IGCSE").toUpperCase();
  const subject = params.get("subject");

  const topicSelect = document.getElementById("topicSelect");

  try {
    const res = await fetch("/assets/data/topics.json");
    if (!res.ok) throw new Error("Failed to fetch topics.json");
    const allTopics = await res.json();

    let subTopics = [];

    if (allTopics[level] && allTopics[level][subject]) {
      const subjBlock = allTopics[level][subject];

      if (Array.isArray(subjBlock)) {
        subTopics = subjBlock;
      } else if (typeof subjBlock === "object") {
        // Handle languages / nested subjects
        for (const key in subjBlock) {
          if (Array.isArray(subjBlock[key])) {
            subTopics.push(...subjBlock[key]);
          }
        }
      }
    }

    if (!subTopics.length) subTopics = ["General"];

    // Populate dropdown
    topicSelect.innerHTML = subTopics
      .map(t => `<option value="${t}">${t}</option>`)
      .join("");

    // Render initial
    updateAll(subject, subTopics[0], level);

    // On change
    topicSelect.addEventListener("change", () =>
      updateAll(subject, topicSelect.value, level)
    );
  } catch (e) {
    console.error(e);
    topicSelect.innerHTML = `<option value="General">General</option>`;
    updateAll(subject, "General", level);
  }
}

function updateAll(subject, topic, level) {
  renderQAs(subject, topic, level);
  renderNotes(subject, topic, level);
  renderVideos(subject, topic, level);
  renderPapers(subject, topic, level);
}

function renderQAs(subject, topic, level) {
  document.getElementById("qa-grid").innerHTML = `
    <div class="card"><div class="card-body">
      <h3>${subject} — ${topic}</h3>
      <button onclick="trackVisit('${level}','${subject}','${topic}','qas')">Open Q&A</button>
    </div></div>`;
}

function renderNotes(subject, topic, level) {
  document.getElementById("notes-grid").innerHTML = `
    <div class="card"><div class="card-body">
      <h3>${subject} — ${topic}</h3>
      <button onclick="trackVisit('${level}','${subject}','${topic}','notes')">Open Notes</button>
    </div></div>`;
}

function renderVideos(subject, topic, level) {
  document.getElementById("videos-grid").innerHTML = `
    <div class="card"><div class="card-body">
      <h3>${subject} — ${topic}</h3>
      <button onclick="trackVisit('${level}','${subject}','${topic}','videos')">Watch Video</button>
    </div></div>`;
}

function renderPapers(subject, topic, level) {
  document.getElementById("papers-list").innerHTML = `
    <div class="card"><div class="card-body">
      <h3>${subject} — ${topic}</h3>
      <button onclick="trackVisit('${level}','${subject}','${topic}','papers')">View Papers</button>
    </div></div>`;
}

// ---------------- Tracking ----------------
function trackVisit(level, subject, topic, type) {
  try {
    const key = "pp:activity";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift({ level, subject, topic, type, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
  } catch {}
}
