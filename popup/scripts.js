// Grab DOM nodes
const button      = document.getElementById('work-break-button');
const minutesSpan = document.getElementById('js-minutes');
const secondsSpan = document.getElementById('js-seconds');

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
  if (intervalId === null) {
    // Kick off the countdown
    intervalId = setInterval(updateTimer, 1000);
    button.textContent = 'Break';
  } else {
    // Pause the countdown
    clearInterval(intervalId);
    intervalId = null;
    button.textContent = 'Work';
  }
});