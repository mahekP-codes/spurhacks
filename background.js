// Default durations in minutes
const default_work_minutes = 25;
const default_break_minutes = 5;

// Lists of sites to block
const socialSites = [
  "*://*.facebook.com/*",
  "*://*.instagram.com/*",
  "*://*.x.com/*",
  "*://*.tiktok.com/*",
  "*://*.reddit.com/*",
  "*://*.youtube.com/*"
];

const workSites = [
  "*://*.slack.com/*",
  "*://*.zoom.us/*",
  "*://*.teams.microsoft.com/*",
  "*://*.mail.google.com/*",
  "*://*.outlook.office.com/*"
];

// Mode: "work" or "break"
let currentMode = "work";
let timerId = null;

// Start timer on extension load
startTimer(default_work_minutes * 60 * 1000); // 25 minutes

function startTimer(durationMs) {
  clearTimeout(timerId); // Clear previous timer if any
  timerId = setTimeout(switchMode, durationMs);
  console.log(`Started ${currentMode} timer for ${durationMs / 1000 / 60} minutes`);
}

function switchMode() {
  currentMode = currentMode === "work" ? "break" : "work";
  const nextDuration = currentMode === "work" ? default_work_minutes : default_break_minutes;
  console.log(`Switched to ${currentMode} mode`);
  startTimer(nextDuration * 60 * 1000);
}

// Main blocker logic
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = details.url;
    if (currentMode === "work" && matchesList(url, socialSites)) {
      return { redirectUrl: chrome.runtime.getURL("blocked.html") };
    }
    if (currentMode === "break" && matchesList(url, workSites)) {
      return { redirectUrl: chrome.runtime.getURL("blocked.html") };
    }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Utility: check if a URL matches a pattern
function matchesList(url, patterns) {
  return patterns.some(pattern => new RegExp(convertPatternToRegex(pattern)).test(url));
}

function convertPatternToRegex(pattern) {
  return "^" + pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*")
    .replace(/\//g, "\\/") + "$";
}

let timerID;
let timerTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'START_TIMER') {
    timerTime = new Date(request.when);
    timerID = setTimeout(() => {
       // the time is app, alert the user.
    }, timerTime.getTime() - Date.now());
  } else if (request.cmd === 'GET_TIME') {
    sendResponse({ time: timerTime });
  }
});