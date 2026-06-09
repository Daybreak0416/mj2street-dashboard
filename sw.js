const CACHE_NAME = 'mahjong-v4.2'; // 버전을 살짝 올려서 리프레시 유도
const ASSETS = [
  './',
  './index.html',
  './manifest2.json',
  './images/icons/icon.png'
];

// 1. 서비스 워커 설치 및 자산 캐싱
self.addEventListener('install', (e) => {
    // e.waitUntil 내부에서 캐싱이 완벽히 끝난 후에 skipWaiting이 실행되도록 안전하게 묶었습니다.
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('필수 자산 캐싱 중...');
                return cache.addAll(ASSETS);
            })
            .then(() => {
                return self.skipWaiting(); // 캐싱 완료 후 안전하게 제어권 획득
            })
            .catch(err => console.error('캐싱 실패 (경로/파일 확인 필요):', err))
    );
});

// 2. 구버전 캐시 청소 및 활성화
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('구버전 캐시 제거 완료:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 핵심: 새 서비스 워커가 즉시 페이지들을 지배하도록 설정
    );
});

// 3. 네트워크 요청 처리 (Cache First, 웹 폰트나 이미지 자산 최적화)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            // 캐시에 있으면 즉시 반환(초고속), 없으면 네트워크에서 가져옴
            return res || fetch(e.request);
        })
    );
});

// 4. 메인 스크립트에서 보낸 skipWaiting 메시지 수신 장치
self.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
