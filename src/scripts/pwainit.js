// eslint-disable-next-line no-unused-vars
var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../../sw.js').then(() => {
    console.log('Service Worker registered!');
  });
}
