// Default durations in minutes
const default_work_minutes = 25;
const default_break_minutes = 5;

// Mode: "work": 1 or "break": 0
let currentMode = 1;
let timerId = null;

// List of sites to block
const socialSites = [
  "||.facebook.com/*",
  "||.instagram.com/*",
  "||.x.com/*",
  "||.tiktok.com/*",
  "||.reddit.com/*",
  "||.youtube.com/*"
];

const workSites = [
  "||.slack.com/",
  "||.zoom.us/",
  "||.teams.microsoft.com/",
  "||.mail.google.com/",
  "||.outlook.office.com/"
];

// Converts a URL pattern to a DNR rule
function createBlockRule(mode) {
  const patterns = mode ? socialSites : workSites;

  return patterns.map((pattern, idx) => ({
    id: idx + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: pattern,
      resourceTypes: ["main_frame"]
    }
  }));
}

function updateRulesForMode(mode) {
  
  const dnrRules = createBlockRule(mode);
  console.log(dnrRules);

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules:    dnrRules,
    removeRuleIds: dnrRules.map(r => r.id)  // or however many you need to clear out
  });
}

updateRulesForMode(currentMode);
console.log("meow");