let breakSites, workSites;
// Mode: "work": 1 or "break": 0
let currentMode = 1;
let timerId = null;
  
let getJSON = function() {
  return new Promise(resolve => {
    fetch('blockRules.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        breakSites = data.breakSites;
        workSites = data.workSites;
        resolve("JSON loaded");
      })
      .catch(err => {
        console.error('Failed to load or parse JSON:', err);
      });
    });
}

let setDNR = async function(){
  const results = await getJSON();
  console.log(results);
  const dnrRules = currentMode ? breakSites : workSites;

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules:    dnrRules,
    removeRuleIds: dnrRules.map(r => r.id)  // or however many you need to clear out
  });
}

getJSON();
setDNR();
