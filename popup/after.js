// at top of after.js
const state = localStorage.getItem('sessionState') || 'before';
if (state === 'during') {
  window.location.href = 'index.html';
}
if (state === 'before') {
  window.location.href = 'before.html';
}

// …then your unload-and-view-report logic…

// Reset to “before” when the user closes the popup
window.addEventListener('beforeunload', () => {
  localStorage.setItem('sessionState','before');
});

// “View Report” opens your dashboard then resets
document.getElementById('view-report-button')
  .addEventListener('click', () => {
    localStorage.setItem('sessionState','before');
    const url = 'https://404notfounders.co';
    if (chrome?.tabs) chrome.tabs.create({ url });
    else window.open(url,'_blank');
    window.close();
  });