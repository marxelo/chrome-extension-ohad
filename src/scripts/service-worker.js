
chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install'|| reason === 'update' ) {
    chrome.tabs.create({
      url: "src/welcome/welcome.html"
    });
  }
});