const state = localStorage.getItem('sessionState') || 'before';
if (state === 'before') {
  window.location.href = 'before.html';
}
if (state === 'after') {
  window.location.href = 'after.html';
}

// Grab DOM nodes
const button      = document.getElementById('work-break-button');
const minutesSpan = document.getElementById('js-minutes');
const secondsSpan = document.getElementById('js-seconds');

// Determine if break mode is on
let breakmode = true;

// Initial work duration (in seconds)
let totalSeconds = 25 * 60;

// Holds our interval so we can clear it
let intervalId = null;

// Format a number < 10 with leading zero
function pad(num) {
  return num < 10 ? '0' + num : num;
}

// Update the DOM each second
function updateTimer() {
  if (totalSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    button.textContent = 'Start';
    alert('⏰ Time for a break!');
    return;
  }
  
  totalSeconds--;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  
  minutesSpan.textContent = pad(mins);
  secondsSpan.textContent = pad(secs);
}

// Handle button clicks: start or pause
button.addEventListener('click', () => {
  if (breakmode) {
    // Kick off the countdown
    clearInterval(intervalId);
    intervalId = null;
    totalSeconds = 25 * 60;
    intervalId = setInterval(updateTimer, 1000);
    button.textContent = 'Break';
    breakmode = false;
  } else {
    // Pause the countdown
    clearInterval(intervalId);
    intervalId = null;
    totalSeconds = 5 * 60;
    intervalId = setInterval(updateTimer, 1000);
    button.textContent = 'Work';
    breakmode = true;
  }
});

const afterLink = document.getElementById('after-work-link');
afterLink.addEventListener('click', e => {
  e.preventDefault();
  localStorage.setItem('sessionState','after');
  window.location.href = 'after.html';
});

//buttons navigation

// DOM refs
const BEFORE = 'before';
const DURING = 'during';
const AFTER  = 'after';

const panels = {
  [BEFORE]:  document.getElementById('before-work'),
  [DURING]:  document.getElementById('during-work'),
  [AFTER]:   document.getElementById('after-work')
};

const startBtn    = document.getElementById('start-button');
const finishBtn   = document.getElementById('finish-button');
const viewReport  = document.getElementById('view-report-button');
const afterLinks   = document.getElementById('after-work-link');
const lengthInput = document.getElementById('session-length');
const minSpan = document.getElementById('js-minutes');
const secSpan = document.getElementById('js-seconds');

let totalSec;
let intId = null;

// Helper: save/load state
function setState(state) {
  localStorage.setItem('sessionState', state);
}
function getState() {
  return localStorage.getItem('sessionState') || BEFORE;
}

// Show the right panel
function show(state) {
  Object.values(panels).forEach(p => p.classList.remove('active'));
  panels[state].classList.add('active');
  setState(state);
}

// Timer logic
function pad(n){ return n<10 ? '0'+n : n; }
function updateTimer() {
  if (totalSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    finishBtn.textContent = 'Finish Work Session';
    show(AFTER);
    return;
  }
  totalSeconds--;
  minutesSpan.textContent = pad(Math.floor(totalSeconds/60));
  secondsSpan.textContent = pad(totalSeconds % 60);
}

// Event wiring
startBtn.addEventListener('click', () => {
  const mins = parseInt(lengthInput.value,10);
  if (isNaN(mins) || mins < 1) return alert('Enter a valid number.');
  totalSeconds = mins * 60;
  // initialize display immediately
  minutesSpan.textContent = pad(mins);
  secondsSpan.textContent = '00';
  intervalId = setInterval(updateTimer, 1000);
  show(DURING);
});

finishBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  show(AFTER);
});

afterLink.addEventListener('click', e => {
  e.preventDefault();
  show(AFTER);
});

viewReport.addEventListener('click', () => {
  // reset state so next open shows BEFORE
  setState(BEFORE);
  // open your dashboard URL
  if (chrome?.tabs) {
    chrome.tabs.create({ url: 'https://your-main-site.com/dashboard' });
  } else {
    window.open('https://your-main-site.com/dashboard', '_blank');
  }
});

// When popup loads
document.addEventListener('DOMContentLoaded', () => {
  const state = getState();
  show(state);
});

// If they close the popup while on AFTER, reset on unload
window.addEventListener('beforeunload', () => {
  if (getState() === AFTER) setState(BEFORE);
});