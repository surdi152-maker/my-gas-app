// =====================================================================================
// SERVICE WORKER - ABSENSI GURU
// Strategi: selalu ambil versi TERBARU saat online (network-first untuk HTML),
// fallback ke cache hanya saat offline. Tidak perlu clear cache manual tiap update.
// =====================================================================================

// Naikkan angka ini kalau suatu saat mengganti daftar APP_SHELL di bawah
// (mis. menambah/menghapus file penting). Untuk update konten biasa (isi index.html,
// logika JS, dsb) TIDAK perlu diubah - network-first di bawah sudah otomatis ambil
// versi terbaru tiap kali online.
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'absensi-guru-' + CACHE_VERSION;

// App shell minimal untuk mode offline dasar. Sengaja tidak memasukkan file besar
// (model face-api.js dari CDN) supaya proses install SW tetap ringan & cepat.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', function (event) {
  self.skipWaiting(); // langsung pakai SW baru, tidak perlu tunggu semua tab lama ditutup
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL).catch(function () {
        // Jangan gagalkan instalasi hanya karena satu file app-shell tidak ditemukan.
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); }) // buang cache versi lama
      );
    }).then(function () {
      return self.clients.claim(); // ambil alih tab yang sedang terbuka juga
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;

  // Jangan sentuh request non-GET (mis. panggilan POST ke Apps Script untuk
  // login/absen/simpan data) - biarkan selalu langsung ke jaringan.
  if (req.method !== 'GET') return;

  var isHtml = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isHtml) {
    // NETWORK-FIRST: selalu coba ambil HTML terbaru dari server dulu.
    event.respondWith(
      fetch(req).then(function (res) {
        var resClone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, resClone); });
        return res;
      }).catch(function () {
        // Offline -> fallback ke versi terakhir yang tersimpan di cache.
        return caches.match(req).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // STALE-WHILE-REVALIDATE untuk asset lain (JS/CSS/CDN/ikon):
  // tampil cepat dari cache, sambil diam-diam refresh cache di belakang layar.
  event.respondWith(
    caches.match(req).then(function (cached) {
      var fetchPromise = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, resClone); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
