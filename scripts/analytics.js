
// scripts/analytics.js
const db = firebase.firestore();

function recordEvent(eventType, details = {}) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const entry = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    eventType,
    details,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("analytics").add(entry)
    .then(() => console.log("Analytics event recorded:", eventType))
    .catch(err => console.error("Analytics error:", err));
}

function setupAnalyticsListeners() {
  const pathname = window.location.pathname;
  if (pathname.includes("dashboard.html")) recordEvent("page_view", { page: "dashboard" });
  else if (pathname.includes("videos.html")) recordEvent("page_view", { page: "videos" });
  else if (pathname.includes("resources.html")) recordEvent("page_view", { page: "resources" });
  else if (pathname.includes("analytics.html")) recordEvent("page_view", { page: "analytics" });

  document.querySelectorAll("a[data-track]").forEach(link => {
    link.addEventListener("click", () => {
      recordEvent("resource_click", { href: link.href, label: link.textContent });
    });
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) setupAnalyticsListeners();
});
