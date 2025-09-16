function markCompleted(paperId) {
  let progress = JSON.parse(localStorage.getItem("progress") || "{}");
  progress[paperId] = "completed";
  localStorage.setItem("progress", JSON.stringify(progress));
  checkBadges();
}

function checkBadges() {
  let progress = JSON.parse(localStorage.getItem("progress") || "{}");
  let completedCount = Object.values(progress).filter(v => v === "completed").length;
  if (completedCount === 1) alert("🎉 First Paper Completed!");
  if (completedCount === 5) alert("🏅 5 Papers Completed!");
}
