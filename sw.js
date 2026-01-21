// JavaScript source code
const CACHE_NAME = 'mahjong-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// 서비스 워커 설치 시 파일 캐싱
self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// 네트워크 요청 시 캐시된 파일이 있으면 반환
self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
});