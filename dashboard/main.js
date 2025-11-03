// const API_BASE = "http://localhost:4000";

// // Example: assume userId is known (hardcoded for demo)
// // In production, get userId via login JWT or session
// const USER_ID = "64fa123456abcdef12345678";

// const auditForm = document.getElementById("auditForm");
// const currentAudit = document.getElementById("currentAudit");
// const auditResultDiv = document.getElementById("auditResult");
// const historyBody = document.getElementById("historyBody");

// // Submit form
// auditForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const url = document.getElementById("urlInput").value.trim();
//   const keyword = document.getElementById("keywordInput").value.trim();

//   if (!url) return alert("Please enter a URL.");

//   auditResultDiv.innerHTML = `<p>Running audit... please wait.</p>`;
//   currentAudit.style.display = "block";

//   try {
//     const res = await fetch(`${API_BASE}/audit`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ url, keyword, userId: USER_ID })
//     });
//     const data = await res.json();
//     if (!data.ok) throw new Error(data.error || "Audit failed");

//     displayAuditResult(data.auditResult);
//     fetchHistory(); // refresh table
//   } catch (err) {
//     auditResultDiv.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
//   }
// });

// // Display audit result
// function displayAuditResult(result) {
//   const cats = result.categories;
//   const audits = result.audits;

//   let html = `
//     <h5>URL: ${result.url}</h5>
//     <table class="table table-bordered mt-3">
//       <thead>
//         <tr>
//           <th>Category</th>
//           <th>Score</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr><td>Performance</td><td>${cats.performance * 100}%</td></tr>
//         <tr><td>SEO</td><td>${cats.seo * 100}%</td></tr>
//         <tr><td>Accessibility</td><td>${cats.accessibility * 100}%</td></tr>
//         <tr><td>Best Practices</td><td>${cats.bestPractices * 100}%</td></tr>
//         <tr><td>PWA</td><td>${cats.pwa * 100}%</td></tr>
//       </tbody>
//     </table>

//     <h5 class="mt-4">Key Metrics</h5>
//     <ul>
//       <li>FCP: ${audits.firstContentfulPaint || "N/A"}</li>
//       <li>LCP: ${audits.largestContentfulPaint || "N/A"}</li>
//       <li>CLS: ${audits.cumulativeLayoutShift || "N/A"}</li>
//       <li>Meta Description: ${audits.metaDescription ? "✅" : "❌"}</li>
//       <li>Canonical Tag: ${audits.canonical ? "✅" : "❌"}</li>
//       <li>Headings: ${audits.headings ? "✅" : "❌"}</li>
//       <li>Structured Data: ${audits.structuredData ? "✅" : "❌"}</li>
//       <li>Mobile Friendly: ${audits.mobileFriendly ? "✅" : "❌"}</li>
//     </ul>
//   `;
//   auditResultDiv.innerHTML = html;
// }

// async function fetchHistory() {
//   try {
//     const res = await fetch(`${API_BASE}/audit/${USER_ID}`); // also make sure backend route is /audit/user/:userId
//     const data = await res.json();
//     if (!data.ok) throw new Error(data.error || "Failed to fetch history");

//     const reports = data.report || []; // <-- fixed key
//     if (!reports.length) {
//       historyBody.innerHTML = `<tr><td colspan="9" class="text-center">No reports yet.</td></tr>`;
//       return;
//     }

//     historyBody.innerHTML = "";
//     reports.forEach((r, i) => {
//       const c = r.auditResult.categories || {};
//       historyBody.innerHTML += `
//         <tr>
//           <td>${i+1}</td>
//           <td>${r.url}</td>
//           <td>${r.keyword || "-"}</td>
//           <td>${new Date(r.createdAt).toLocaleString()}</td>
//           <td>${Math.round((c.performance || 0)*100)}%</td>
//           <td>${Math.round((c.seo || 0)*100)}%</td>
//           <td>${Math.round((c.accessibility || 0)*100)}%</td>
//           <td>${Math.round((c.bestPractices || 0)*100)}%</td>
//           <td>${Math.round((c.pwa || 0)*100)}%</td>
//         </tr>
//       `;
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// // Initial fetch
// fetchHistory();


const API_BASE = "http://localhost:4000";




// Example static userId for testing
const USER_ID = "64fa123456abcdef12345678";




const auditForm = document.getElementById("auditForm");
const currentAudit = document.getElementById("currentAudit");
const auditResultDiv = document.getElementById("auditResult");
const historyBody = document.getElementById("historyBody");




// Submit new audit
auditForm.addEventListener("submit", async (e) => {
e.preventDefault();
const url = document.getElementById("urlInput").value.trim();
const keyword = document.getElementById("keywordInput").value.trim();




if (!url) return alert("Please enter a URL.");




auditResultDiv.innerHTML = '<p>🚀 Running Lighthouse audit... please wait.</p>';
currentAudit.style.display = "block";




try {
const res = await fetch(`${API_BASE}/audit`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ url, keyword, userId: USER_ID }),
});

const data = await res.json();
if (!data.ok) throw new Error(data.error || "Audit failed");

displayAuditResult(data.auditResult);
await fetchHistory();




} catch (err) {
auditResultDiv.innerHTML = `<p class="text-danger">❌ Error: ${err.message}</p>`;
}
});




// Display full Lighthouse audit result
function displayAuditResult(result) {
if (!result) {
auditResultDiv.innerHTML = '<p>No result received.</p>';
return;
}




const { categories = {}, performance = {}, seo = {}, accessibility = {}, bestPractices = {}, pwa = {}, keywordHints = {} } = result;




const html = `
Audit Summary for: ${result.url}
Audited at: ${new Date(result.fetchTime || Date.now()).toLocaleString()}

<table class="table table-bordered mt-3">
  <thead><tr><th>Category</th><th>Score</th></tr></thead>
  <tbody>
    <tr><td>Performance</td><td>${(categories.performance * 100 || 0).toFixed(0)}%</td></tr>
    <tr><td>Accessibility</td><td>${(categories.accessibility * 100 || 0).toFixed(0)}%</td></tr>
    <tr><td>SEO</td><td>${(categories.seo * 100 || 0).toFixed(0)}%</td></tr>
    <tr><td>Best Practices</td><td>${(categories.bestPractices * 100 || 0).toFixed(0)}%</td></tr>
    <tr><td>PWA</td><td>${(categories.pwa * 100 || 0).toFixed(0)}%</td></tr>
  </tbody>
</table>

<h5 class="mt-4">Performance Metrics</h5>
<ul>
  <li>First Contentful Paint: ${performance.firstContentfulPaint || "N/A"}</li>
  <li>Speed Index: ${performance.speedIndex || "N/A"}</li>
  <li>Largest Contentful Paint: ${performance.largestContentfulPaint || "N/A"}</li>
  <li>Time To Interactive: ${performance.timeToInteractive || "N/A"}</li>
  <li>Total Blocking Time: ${performance.totalBlockingTime || "N/A"}</li>
  <li>Cumulative Layout Shift: ${performance.cumulativeLayoutShift || "N/A"}</li>
  <li>Server Response Time: ${performance.serverResponseTime || "N/A"}</li>
  <li>DOM Size: ${performance.domSize || "N/A"}</li>
</ul>

<h5 class="mt-4">SEO Insights</h5>
<ul>
  <li>Meta Description: ${seo.metaDescription ? "✅" : "❌"}</li>
  <li>Title: ${seo.title ? "✅" : "❌"}</li>
  <li>Canonical Tag: ${seo.canonical ? "✅" : "❌"}</li>
  <li>Structured Data: ${seo.structuredData ? "✅" : "❌"}</li>
  <li>Mobile Friendly: ${seo.mobileFriendly ? "✅" : "❌"}</li>
  <li>Font Size OK: ${seo.fontSize ? "✅" : "❌"}</li>
  <li>Tap Targets OK: ${seo.tapTargets ? "✅" : "❌"}</li>
  <li>HTTP Status: ${seo.httpStatusCode || "N/A"}</li>
  <li>Indexable: ${seo.isIndexable ? "✅" : "❌"}</li>
</ul>

<h5 class="mt-4">Accessibility Checks</h5>
<ul>
  <li>Color Contrast: ${accessibility.colorContrast ? "✅" : "❌"}</li>
  <li>Alt Text: ${accessibility.altText ? "✅" : "❌"}</li>
  <li>ARIA Roles: ${accessibility.ariaRoles ? "✅" : "❌"}</li>
  <li>Form Labels: ${accessibility.label ? "✅" : "❌"}</li>
</ul>

<h5 class="mt-4">Best Practices</h5>
<ul>
  <li>HTTPS: ${bestPractices.usesHttps ? "✅" : "❌"}</li>
  <li>No Vulnerable Libraries: ${bestPractices.noVulnerableLibraries ? "✅" : "❌"}</li>
  <li>External Links Use rel=noopener: ${bestPractices.externalAnchorsUseRelNoopener ? "✅" : "❌"}</li>
  <li>Valid Doctype: ${bestPractices.validDoctype ? "✅" : "❌"}</li>
</ul>

<h5 class="mt-4">Keyword Hints</h5>
<p><strong>Title Keywords:</strong> ${(keywordHints.titleWords || []).join(", ")}</p>
<p><strong>Meta Keywords:</strong> ${(keywordHints.metaWords || []).join(", ")}</p>
<p><strong>Heading Keywords:</strong> ${(keywordHints.headingsWords || []).join(", ")}</p>




`;




auditResultDiv.innerHTML = html;
}




// Fetch previous audits for user
async function fetchHistory() {
try {
const res = await fetch(`${API_BASE}/audit/${USER_ID}`);
const data = await res.json();
if (!data.ok) throw new Error(data.error || "Failed to fetch history");

const reports = data.report || [];
if (!reports.length) {
  historyBody.innerHTML = `<tr><td colspan="9" class="text-center">No reports yet.</td></tr>`;
  return;
}

historyBody.innerHTML = reports
  .map((r, i) => {
    const c = r.auditResult?.categories || {};
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${r.url}</td>
        <td>${r.keyword || "-"}</td>
        <td>${new Date(r.createdAt).toLocaleString()}</td>
        <td>${Math.round((c.performance || 0) * 100)}%</td>
        <td>${Math.round((c.seo || 0) * 100)}%</td>
        <td>${Math.round((c.accessibility || 0) * 100)}%</td>
        <td>${Math.round((c.bestPractices || 0) * 100)}%</td>
        <td>${Math.round((c.pwa || 0) * 100)}%</td>
      </tr>
    `;
  })
  .join("");




} catch (err) {
console.error("History fetch error:", err);
}
}




// Initial load
fetchHistory();