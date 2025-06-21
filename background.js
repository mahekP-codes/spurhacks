// Default durations in minutes
const default_work_minutes = 25;
const default_break_minutes = 5;

// Mode: "work" or "break"
let currentMode = "work";
let timerId = null;

// List of sites to block
const socialSites = [
  "||.facebook.com/",
  "||.instagram.com/",
  "||.x.com/",
  "||.tiktok.com/",
  "||.reddit.com/",
  "||.youtube.com/"
];

const workSites = [
  "||.slack.com/",
  "||.zoom.us/",
  "||.teams.microsoft.com/",
  "||.mail.google.com/",
  "||.outlook.office.com/"
];

// Converts a URL pattern to a DNR rule
function createBlockRule(id, urlPattern) {
  return {
    id: id,
    priority: 1,
    action: {
      type: "block"
    },
    condition: {
      urlFilter: urlPattern,
      resourceTypes: ["main_frame"]
    }
  };
}

function updateRulesForMode(mode) {
  const blockList = mode === "work" ? socialSites : workSites;

  const rules = blockList.map((site, index) =>
    createBlockRule(index + 1, site)
  );

  // Remove all previous dynamic rules and add new ones
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: rules.map(r => r.id),
      addRules: rules
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("DNR Update Error:", chrome.runtime.lastError);
      } else {
        console.log(`Applied ${mode} mode rules.`);
      }
    }
  );
}

function startTimer(durationMs) {
  clearTimeout(timerId);
  timerId = setTimeout(switchMode, durationMs);
  console.log(`Started ${currentMode} timer for ${durationMs / 60000} minutes`);
}

function switchMode() {
  currentMode = currentMode === "work" ? "break" : "work";
  const nextDuration = currentMode === "work" ? default_work_minutes : default_break_minutes;
  console.log(`Switched to ${currentMode} mode`);
  updateRulesForMode(currentMode);
  startTimer(nextDuration * 60 * 1000);
}

// Start with work mode
chrome.runtime.onStartup.addListener(() => {
  updateRulesForMode(currentMode);
  startTimer(default_work_minutes * 60 * 1000);
});

chrome.runtime.onInstalled.addListener(() => {
  updateRulesForMode(currentMode);
  startTimer(default_work_minutes * 60 * 1000);
});