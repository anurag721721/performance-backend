// import lighthouse from "lighthouse";
// import { launch } from "chrome-launcher";

// /**
//  * Runs Lighthouse audit for a given URL
//  * @param {string} url - URL to audit
//  * @returns JSON object with scores and categories
//  */
// export async function runLighthouseAudit(url) {
//   const chrome = await launch({ chromeFlags: ["--headless"] });
//   const options = { logLevel: "info", output: "json", port: chrome.port };

//   const runnerResult = await lighthouse(url, options);
//   const report = JSON.parse(runnerResult.report);

//   await chrome.kill();

//   const categories = report.categories || {};
//   const audits = report.audits || {};

//   return {
//     url,
//     categories: {
//       performance: categories.performance?.score ?? 0,
//       accessibility: categories.accessibility?.score ?? 0,
//       seo: categories.seo?.score ?? 0,
//       bestPractices: categories["best-practices"]?.score ?? 0,
//       pwa: categories.pwa?.score ?? 0,
//     },
//     audits: {
//       firstContentfulPaint: audits["first-contentful-paint"]?.displayValue ?? "N/A",
//       largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
//       cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
//       metaDescription: audits["meta-description"]?.score ?? null,
//       viewport: audits["viewport"]?.score ?? null,
//       canonical: audits["canonical"]?.score ?? null,
//       structuredData: audits["structured-data"]?.score ?? null,
//       headings: audits["heading-levels"]?.score ?? null,
//       mobileFriendly: audits["uses-responsive-images"]?.score ?? null,
//     },
//   };
// }


// import lighthouse from "lighthouse";
// import { launch } from "chrome-launcher";

// export async function runLighthouseAudit(url) {
//   const chrome = await launch({
//     chromeFlags: [
//       "--headless=new",
//       "--disable-gpu",
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//     ],
//     logLevel: "info",
//   });

//   const options = {
//     logLevel: "info",
//     output: "json",
//     port: chrome.port,
//     maxWaitForFcp: 45000,
//     maxWaitForLoad: 60000,
//   };

//   try {
//     const runnerResult = await lighthouse(url, options);
//     const report = JSON.parse(runnerResult.report);

//     const categories = report.categories || {};
//     const audits = report.audits || {};

//     return {
//       url,
//       categories: {
//         performance: categories.performance?.score ?? 0,
//         accessibility: categories.accessibility?.score ?? 0,
//         seo: categories.seo?.score ?? 0,
//         bestPractices: categories["best-practices"]?.score ?? 0,
//         pwa: categories.pwa?.score ?? 0,
//       },
//       audits: {
//         firstContentfulPaint: audits["first-contentful-paint"]?.displayValue ?? "N/A",
//         largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue ?? "N/A",
//         cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue ?? "N/A",
//         metaDescription: audits["meta-description"]?.score ?? null,
//         viewport: audits["viewport"]?.score ?? null,
//         canonical: audits["canonical"]?.score ?? null,
//         structuredData: audits["structured-data"]?.score ?? null,
//         headings: audits["heading-levels"]?.score ?? null,
//         mobileFriendly: audits["uses-responsive-images"]?.score ?? null,
//       },
//     };
//   } finally {
//     await chrome.kill();
//   }
// }


import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

/**
 * Run a full Lighthouse audit and extract max useful SEO + Performance data
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function runLighthouseAudit(url) {
  const chrome = await launch({
    chromeFlags: [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const options = {
    logLevel: "error",
    output: "json",
    port: chrome.port,
    onlyCategories: ["performance", "accessibility", "best-practices", "seo", "pwa"],
    maxWaitForFcp: 60000,
    maxWaitForLoad: 90000,
  };

  try {
    const runnerResult = await lighthouse(url, options);
    const report = JSON.parse(runnerResult.report);

    const { categories, audits } = report;

    // helper for safely extracting audit values
    const val = (key, field = "displayValue") => audits[key]?.[field] ?? null;

    return {
      url,
      fetchTime: report.fetchTime,
      userAgent: report.userAgent,
      finalUrl: report.finalUrl,

      categories: {
        performance: categories.performance?.score ?? 0,
        accessibility: categories.accessibility?.score ?? 0,
        seo: categories.seo?.score ?? 0,
        bestPractices: categories["best-practices"]?.score ?? 0,
        pwa: categories.pwa?.score ?? 0,
      },

      performance: {
        firstContentfulPaint: val("first-contentful-paint"),
        speedIndex: val("speed-index"),
        largestContentfulPaint: val("largest-contentful-paint"),
        timeToInteractive: val("interactive"),
        totalBlockingTime: val("total-blocking-time"),
        cumulativeLayoutShift: val("cumulative-layout-shift"),
        serverResponseTime: val("server-response-time"),
        bootupTime: val("bootup-time"),
        domSize: val("dom-size"),
      },

      seo: {
        metaDescription: val("meta-description", "score"),
        title: val("document-title", "score"),
        hreflang: val("hreflang", "score"),
        canonical: val("canonical", "score"),
        linkText: val("link-text", "score"),
        httpStatusCode: audits["http-status-code"]?.numericValue ?? null,
        robotsTxt: val("robots-txt", "score"),
        isIndexable: audits["is-crawlable"]?.score ?? null,
        tapTargets: val("tap-targets", "score"),
        fontSize: val("font-size", "score"),
        mobileFriendly: val("uses-responsive-images", "score"),
        structuredData: val("structured-data", "score"),
        headingLevels: val("heading-levels", "score"),
        crawlErrors: audits["crawlable-anchors"]?.details?.items?.length ?? 0,
      },

      accessibility: {
        colorContrast: val("color-contrast", "score"),
        altText: val("image-alt", "score"),
        ariaRoles: val("aria-allowed-attr", "score"),
        label: val("label", "score"),
        tabOrder: val("tabindex", "score"),
      },

      bestPractices: {
        usesHttps: val("is-on-https", "score"),
        validDoctype: val("doctype", "score"),
        noVulnerableLibraries: val("no-vulnerable-libraries", "score"),
        externalAnchorsUseRelNoopener: val("external-anchors-use-rel-noopener", "score"),
        jsLibraries: audits["js-libraries"]?.details?.items || [],
      },

      pwa: {
        serviceWorker: val("service-worker", "score"),
        manifest: val("manifest-short-name-length", "score"),
        offlineCapability: val("works-offline", "score"),
      },

      meta: {
        titleText: audits["document-title"]?.title ?? null,
        descriptionText: audits["meta-description"]?.description ?? null,
        viewport: audits["viewport"]?.score ?? null,
        charset: audits["uses-http2"]?.score ?? null,
        crawlable: audits["is-crawlable"]?.score ?? null,
      },

      // Extract keyword hints from title/description/headings if possible
      keywordHints: {
        titleWords: audits["document-title"]?.title?.split(/\s+/).slice(0, 10) ?? [],
        metaWords: audits["meta-description"]?.description?.split(/\s+/).slice(0, 10) ?? [],
        headingsWords:
          audits["heading-levels"]?.details?.items
            ?.flatMap((h) => (h?.snippet || "").split(/\s+/))
            .slice(0, 10) ?? [],
      },
    };
  } catch (err) {
    console.error("Lighthouse error:", err);
    throw new Error(err.message || "Lighthouse audit failed");
  } finally {
    await chrome.kill();
  }
}
