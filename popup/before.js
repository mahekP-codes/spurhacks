// Redirect to the correct page if state isn't “before”
const state = localStorage.getItem('sessionState') || 'before';
if (state === 'during')  window.location.href = 'index.html';
if (state === 'after')   window.location.href = 'after.html';

const startBtn = document.getElementById('start-button');
startBtn.addEventListener('click', () => {
  const mins = parseInt(document.getElementById('session-length').value, 10);
  if (isNaN(mins) || mins < 1) {
    return alert('Please enter a valid number of minutes.');
  }
  // set up timer state
  localStorage.setItem('sessionState', 'during');
  localStorage.setItem('sessionLength', mins);
  location.href = 'index.html';
});