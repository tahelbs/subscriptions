// ===== Service worker: האפליקציה נפתחת גם בלי אינטרנט =====
// זה קובץ שהדפדפן מריץ ברקע. הוא שומר עותק של קבצי האפליקציה.
// השיטה: "קודם רשת". כשיש אינטרנט מביאים את הגרסה הכי חדשה (ושומרים ממנה עותק),
// וכשאין, משתמשים בעותק השמור. ככה עדכונים מגיעים מיד, ובלי חיבור הכול ממשיך לעבוד.
// הנתונים עצמם (המנויים) לא כאן: הם שמורים ב-localStorage של הדפדפן.

const CACHE = 'subscriptions-v1';

// הקבצים שנשמרים כבר בהתקנה
const FILES = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
];

// התקנה: שומרים עותק של כל הקבצים
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

// הפעלה: מוחקים עותקים ישנים (אם בעתיד נשנה את שם ה-CACHE)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

// כל בקשה לקובץ של האפליקציה: קודם מנסים מהרשת, ואם אין חיבור לוקחים את העותק השמור
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // רק בקשות רגילות לקבצים שלנו (לא הגופן מ-Google, לא אתרים אחרים)
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches
          .match(request, { ignoreSearch: true })
          .then((cached) => cached || caches.match('index.html'))
      )
  );
});
