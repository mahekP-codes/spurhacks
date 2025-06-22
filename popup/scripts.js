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