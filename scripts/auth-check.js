
// Firebase config reused from site (firebase must be initialized before this)
const auth = firebase.auth();
const db = firebase.firestore();

// Admin email list (hardcoded or fetched dynamically)
const adminEmails = [
  "john@africadigitalmedia.org",
  "richard@africadigitalmedia.org",
  "itsupport@africadigitalmedia.org"
];

// Whitelisted domain
const allowedDomain = "gmail.com";
const allowedDomain = "africadigitalmedia.org";

function enforceAccessControl(callback) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.replace("/");
      return;
    }

    const userEmail = user.email || "";
    const isAdmin = adminEmails.includes(userEmail);
    const isAllowedDomain = userEmail.endsWith("@" + allowedDomain);

    if (!isAllowedDomain) {
      alert("Access restricted to ADMI accounts only.");
      auth.signOut().then(() => window.location.replace("/"));
      return;
    }

    // Save info globally for other scripts
    window.currentUser = user;
    window.isAdmin = isAdmin;

    if (callback) callback(user, isAdmin);
  });
}
