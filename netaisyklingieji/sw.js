// Netaisyklingieji: žaidimas perkeltas į bendrą svetainę. Šis failas tik išjungia seną talpyklą senuose įrenginiuose.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.indexOf("netaisyklingieji-") === 0).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
