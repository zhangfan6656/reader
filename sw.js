const CACHE = 'air-cache-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
const CDN = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([...CORE, ...CDN]).catch(() => {})));
});

// 收到页面「立即更新」指令后再激活新版本
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 动态接口不缓存：Supabase / OpenAI 等 API 始终走网络
  if (/supabase\.co$/.test(url.host) || /\/chat\/completions/.test(url.pathname)) return;

  // 页面导航：网络优先，失败回退缓存的 index（离线可用）
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { const cl = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cl)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 静态资源 / CDN 库：缓存优先，回源后写入缓存
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => {
      if (r && r.ok && (url.origin === location.origin || /jsdelivr\.net$|unpkg\.com$/.test(url.host))) {
        const cl = r.clone();
        caches.open(CACHE).then(c => c.put(req, cl));
      }
      return r;
    }).catch(() => cached))
  );
});
