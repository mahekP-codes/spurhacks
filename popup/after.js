const state = localStorage.getItem('sessionState') || 'before';
if (state === 'during') {
  window.location.href = 'index.html';
}
if (state === 'before') {
  window.location.href = 'before.html';
}

window.addEventListener('beforeunload', () => {
  localStorage.setItem('sessionState','before');
});

document.getElementById('view-report-button')
  .addEventListener('click', () => {
    localStorage.setItem('sessionState','before');
    const url = 'https://hackathon.mahekpatel.com';
    if (chrome?.tabs) chrome.tabs.create({ url });
    else window.open(url,'_blank');
    window.close();
  });