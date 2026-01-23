const CACHE_NAME = 'mahjong-v2'; // 버전을 올려서 새 캐시 생성 유도
const ASSETS = [
  './',             // 루트 경로 추가
  './index.html',
  './manifest.json',
  './icon.png'
];

// 서비스 워커 설치
self.addEventListener('install', (e) => {
    self.skipWaiting(); // 새로운 서비스 워커가 발견되면 즉시 활성화
    e.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// 핵심: 이전 버전 캐시 삭제 로직
self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keys) => {
          return Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('구버전 캐시 삭제:', key);
                    return caches.delete(key); // v1 캐시를 삭제함
                }
            })
          );
      })
    );
});

// 네트워크 요청 처리
self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((res) => {
          // 캐시에 있으면 반환하되, 없으면 네트워크에서 가져옴
          return res || fetch(e.request);
      })
    );
});