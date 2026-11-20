// ===== הגדרות קבועות =====

// המפתחות שתחתיהם נשמרים הנתונים ב-localStorage
const STORAGE_KEY = 'subscriptions';
const SETTINGS_KEY = 'settings';

// חיוב בעוד כמה ימים או פחות מסומן בכרטיס בצבע מודגש
const SOON_DAYS = 3;

// כמה גווני צבע יש לקטגוריות (מוגדרים ב-style.css בשמות tone-0 עד tone-5)
const TONE_COUNT = 6;
const TONE_NAMES = ['אפרסק', 'ענבר', 'מרווה', 'תכלת', 'לבנדר', 'ורד'];

// האפשרויות שמותר לבחור בהגדרות
const ACCENTS = ['terracotta', 'sage', 'ocean', 'plum', 'rose'];
const THEMES = ['auto', 'light', 'dark'];
const UPCOMING_OPTIONS = [3, 7, 14];

// כמה ימים לפני חידוש שנתי להתחיל להזכיר (נבחר בהגדרות)
const RENEWAL_NOTICE_OPTIONS = [14, 30, 60];

// ההחלטות האפשריות לגבי חידוש שנתי. מחרוזת ריקה = "עוד לא החלטתי"
const RENEW_DECISIONS = ['renew', 'cancel'];

// תדירויות החיוב האפשריות.
// perYear = כמה פעמים בשנה המנוי מחויב, months = כמה חודשים בין חיוב לחיוב (0 = לפי שבועות)
const FREQUENCIES = {
  weekly: { per: 'לשבוע', every: 'כל שבוע', adjective: 'השבועי', group: 'חיובים שבועיים', perYear: 52, months: 0 },
  monthly: { per: 'לחודש', every: 'כל חודש', adjective: 'החודשי', group: 'חיובים חודשיים', perYear: 12, months: 1 },
  bimonthly: { per: 'לחודשיים', every: 'כל חודשיים', adjective: 'הדו-חודשי', group: 'חיובים דו-חודשיים', perYear: 6, months: 2 },
  quarterly: { per: 'לרבעון', every: 'כל 3 חודשים', adjective: 'הרבעוני', group: 'חיובים רבעוניים', perYear: 4, months: 3 },
  yearly: { per: 'לשנה', every: 'פעם בשנה', adjective: 'השנתי', group: 'חיובים שנתיים', perYear: 1, months: 12 },
};

// מחזיר את פרטי התדירות של מנוי. ערך לא מוכר נחשב חודשי
function frequencyOf(sub) {
  return Object.hasOwn(FREQUENCIES, sub.frequency) ? FREQUENCIES[sub.frequency] : FREQUENCIES.monthly;
}

// הקטגוריות שיש למשתמש חדש, כל אחת עם הגוון שלה
const DEFAULT_CATEGORIES = [
  { name: 'בידור', tone: 0 },
  { name: 'אחר', tone: 1 },
  { name: 'תוכנה', tone: 2 },
  { name: 'תקשורת', tone: 3 },
  { name: 'בריאות', tone: 5 },
];

// ===== אייקונים =====
// כל אייקון הוא ציור קווי קטן (SVG) בגודל 24x24.
// הם מצוירים בצבע currentColor, כלומר בצבע הטקסט של מה שעוטף אותם,
// וכך כל אייקון מקבל אוטומטית את הצבע של הקטגוריה
const ICONS = {
  tv: { label: 'טלוויזיה', svg: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/>' },
  film: { label: 'סרטים', svg: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>' },
  music: { label: 'מוזיקה', svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  headphones: { label: 'פודקאסטים', svg: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>' },
  book: { label: 'ספרים', svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
  news: { label: 'עיתון', svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>' },
  cloud: { label: 'ענן', svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>' },
  monitor: { label: 'מחשב', svg: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' },
  code: { label: 'פיתוח', svg: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>' },
  phone: { label: 'סלולר', svg: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>' },
  wifi: { label: 'אינטרנט', svg: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>' },
  activity: { label: 'כושר', svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  heart: { label: 'בריאות', svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  shield: { label: 'ביטוח', svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  home: { label: 'בית', svg: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>' },
  zap: { label: 'חשמל', svg: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>' },
  droplet: { label: 'מים', svg: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>' },
  card: { label: 'כרטיס אשראי', svg: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>' },
  bag: { label: 'קניות', svg: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>' },
  box: { label: 'משלוחים', svg: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>' },
  coffee: { label: 'קפה', svg: '<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>' },
  gift: { label: 'מתנות', svg: '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>' },
  star: { label: 'אחר', svg: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
};

// אייקונים של הממשק עצמו (לתובנות ולכפתורים). הם לא מופיעים בבחירת אייקון למנוי
const UI_ICONS = {
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  pie: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  trending: '<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  coffee: ICONS.coffee.svg,
  bulb: '<path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
};

// בונה תגית SVG שלמה מתוך הציור של אייקון.
// מותר להשתמש כאן ב-innerHTML, כי הציורים הם קבועים שלנו ולא טקסט של המשתמש
function svgIcon(paths, size) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

// בודק שזה שם של אייקון שקיים אצלנו.
// Object.hasOwn בודק רק את האייקונים שלנו, ולא מילים מיוחדות כמו "constructor"
function hasIcon(id) {
  return typeof id === 'string' && Object.hasOwn(ICONS, id);
}

// ===== כיוון טקסט =====

// עוטף שם בסימנים בלתי נראים שמבודדים את הכיוון שלו.
// בלי זה, שם באנגלית בתוך משפט בעברית עלול להתבלגן: "Disney+" מוצג כ-"+Disney"
function isolate(text) {
  return `\u2068${text}\u2069`;
}

// ===== מחירים =====

// כלים לעיצוב מחירים בשקלים: אחד למספר שלם (‏30 ₪) ואחד לאגורות (‏29.90 ₪)
const wholePriceFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});
const centsPriceFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// מחיר עגול מוצג בלי נקודה עשרונית, ומחיר עם אגורות תמיד עם שתי ספרות
function formatPrice(amount) {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded)
    ? wholePriceFormatter.format(rounded)
    : centsPriceFormatter.format(rounded);
}

// ===== אלמנטים מהדף =====
const pageTitle = document.getElementById('page-title');
const list = document.getElementById('subscription-list');
const emptyMessage = document.getElementById('empty-message');
const monthlyTotalEl = document.getElementById('monthly-total');
const yearlyTotalEl = document.getElementById('yearly-total');
const subscriptionCountEl = document.getElementById('subscription-count');
const budgetEl = document.getElementById('budget');
const budgetFill = document.getElementById('budget-fill');
const budgetText = document.getElementById('budget-text');
const cardTemplate = document.getElementById('card-template');
const upcomingSection = document.getElementById('upcoming');
const upcomingTitle = document.getElementById('upcoming-title');
const upcomingList = document.getElementById('upcoming-list');
const upcomingTotalEl = document.getElementById('upcoming-total');
const categoryFilter = document.getElementById('category-filter');
const insightsSection = document.getElementById('insights');
const insightsList = document.getElementById('insights-list');
const exampleBanner = document.getElementById('example-banner');
const breakdownEl = document.getElementById('breakdown');
const renewalsSection = document.getElementById('renewals');
const renewalsList = document.getElementById('renewals-list');
const renewalsTotal = document.getElementById('renewals-total');
const renewalAlert = document.getElementById('renewal-alert');
const renewalAlertTitle = document.getElementById('renewal-alert-title');
const renewalAlertList = document.getElementById('renewal-alert-list');
const renewalField = document.getElementById('renewal-price-field');
const savingsSection = document.getElementById('savings');
const savingsList = document.getElementById('savings-list');
const whatIfList = document.getElementById('whatif-list');
const whatIfResult = document.getElementById('whatif-result');
const breakdownBody = document.getElementById('breakdown-body');

// טופס המנוי
const dialog = document.getElementById('form-dialog');
const form = document.getElementById('subscription-form');
const formTitle = document.getElementById('form-title');
const categoryOptions = document.getElementById('category-options');
const iconPicker = document.getElementById('icon-picker');

// חלון ההגדרות
const settingsDialog = document.getElementById('settings-dialog');
const settingsForm = document.getElementById('settings-form');
const categoryEditor = document.getElementById('category-editor');
const newCategoryInput = document.getElementById('new-category');

// ===== הודעות וחלון אישור =====
// דפדפנים מסוימים (וגם תצוגה של הדף בתוך אתר אחר) לא מציגים alert() ו-confirm(),
// אז יש לנו גרסאות משלנו, בתוך הדף

const toast = document.getElementById('toast');
let toastTimer = null;

// מציג הודעה קצרה בתחתית המסך לכמה שניות
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  // popover מציג את ההודעה מעל הכול, גם מעל חלון פתוח
  try {
    if (toast.matches(':popover-open')) toast.hidePopover();
    toast.showPopover();
  } catch (error) {}

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    try {
      toast.hidePopover();
    } catch (error) {}
    toast.hidden = true;
  }, 3200);
}

const confirmDialog = document.getElementById('confirm-dialog');
const confirmMessage = document.getElementById('confirm-message');
const confirmYes = document.getElementById('confirm-yes');
let resolveConfirm = null;

// שואל שאלת כן/לא בתוך הדף. מחזיר Promise, ולכן משתמשים בו עם await:
//   if (await askConfirm('למחוק?', 'מחיקה', true)) { ... }
// danger = true צובע את כפתור האישור באדום (לפעולות כמו מחיקה)
function askConfirm(message, confirmLabel, danger) {
  confirmMessage.textContent = message;
  confirmYes.textContent = confirmLabel;
  confirmYes.classList.toggle('danger-fill', Boolean(danger));
  confirmYes.classList.toggle('primary', !danger);
  confirmDialog.showModal();
  return new Promise((resolve) => {
    resolveConfirm = resolve;
  });
}

// סוגר את חלון האישור ומחזיר את התשובה למי שחיכה לה
function finishConfirm(answer) {
  const resolve = resolveConfirm;
  resolveConfirm = null;
  if (confirmDialog.open) confirmDialog.close();
  if (resolve) resolve(answer);
}

confirmYes.addEventListener('click', () => finishConfirm(true));
document.getElementById('confirm-no').addEventListener('click', () => finishConfirm(false));
// סגירה ב-Esc נחשבת "לא"
confirmDialog.addEventListener('close', () => finishConfirm(false));

// ===== מצב האפליקציה =====

// המנוי שנמצא כרגע בעריכה. null אומר שמוסיפים מנוי חדש
let editingId = null;

// הקטגוריה שנבחרה בסינון. null אומר "הכל".
// מחרוזת ריקה ('') היא המנויים שאין להם קטגוריה
let selectedCategory = null;

// ההגדרות האישיות (שם, צבע, מראה, תזכורת, תקציב וקטגוריות)
let settings = loadSettings();

// עותק עבודה של הקטגוריות בזמן שחלון ההגדרות פתוח.
// השינויים נשמרים באמת רק כשלוחצים "שמירה"
let draftCategories = [];

// ===== שמירה וטעינה של מנויים =====

// כותב ל-localStorage. בדפדפן שחוסם שמירה (למשל חלון פרטי) זה עלול להיכשל,
// ואז מציגים הודעה במקום שהאפליקציה תקרוס
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('לא הצלחתי לשמור', error);
    showToast('לא הצלחתי לשמור. ייתכן שהדפדפן חוסם שמירת נתונים');
    return false;
  }
}

// קורא את רשימת המנויים מ-localStorage. אם אין כלום, מחזיר רשימה ריקה
function loadSubscriptions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('לא הצלחתי לקרוא את הנתונים', error);
    return [];
  }
}

// שומר את רשימת המנויים ב-localStorage (כטקסט JSON)
function saveSubscriptions(subscriptions) {
  writeStorage(STORAGE_KEY, subscriptions);
}

// ===== הגדרות אישיות =====

// ההגדרות של משתמש חדש
function defaultSettings() {
  return {
    name: '',
    accent: 'terracotta',
    theme: 'auto',
    upcomingDays: 7,
    renewalNotice: 30,
    budget: 0,
    categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
  };
}

// בודק הגדרות (מ-localStorage או מקובץ גיבוי) ומחזיר גרסה תקינה.
// כל ערך חסר או שגוי מוחלף בברירת המחדל
function cleanSettings(raw) {
  const defaults = defaultSettings();
  if (!raw || typeof raw !== 'object') return defaults;

  const budget = Number(raw.budget);

  return {
    name: typeof raw.name === 'string' ? raw.name.trim().slice(0, 30) : '',
    accent: ACCENTS.includes(raw.accent) ? raw.accent : defaults.accent,
    theme: THEMES.includes(raw.theme) ? raw.theme : defaults.theme,
    upcomingDays: UPCOMING_OPTIONS.includes(raw.upcomingDays) ? raw.upcomingDays : defaults.upcomingDays,
    renewalNotice: RENEWAL_NOTICE_OPTIONS.includes(raw.renewalNotice) ? raw.renewalNotice : defaults.renewalNotice,
    budget: budget > 0 ? Math.round(budget * 100) / 100 : 0,
    categories: Array.isArray(raw.categories) ? cleanCategories(raw.categories) : defaults.categories,
  };
}

// בודק רשימת קטגוריות: בלי שמות ריקים, בלי כפילויות, ועם גוון תקין לכל אחת
function cleanCategories(categories) {
  const result = [];

  for (const item of categories) {
    const name = String(item?.name ?? '').trim();
    if (!name || result.some((category) => category.name === name)) continue;

    const toneOk = Number.isInteger(item.tone) && item.tone >= 0 && item.tone < TONE_COUNT;
    result.push({ name, tone: toneOk ? item.tone : pickTone(result) });
  }

  return result;
}

function loadSettings() {
  try {
    return cleanSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY)));
  } catch (error) {
    return defaultSettings();
  }
}

function saveSettings(newSettings) {
  writeStorage(SETTINGS_KEY, newSettings);
}

// ===== מראה: צבע ומצב בהיר/כהה =====

// שאילתה ששואלת את מערכת ההפעלה אם המכשיר במצב כהה
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

// האם "לפי המכשיר" צריך להיות כהה?
// אם הדף מוצג בתוך אתר שקבע בהיר או כהה (data-theme על <html>), הולכים לפיו.
// אחרת שואלים את מערכת ההפעלה
function systemPrefersDark() {
  const host = document.documentElement.dataset.theme;
  if (host === 'dark') return true;
  if (host === 'light') return false;
  return darkQuery.matches;
}

// מחיל צבע ומראה על הדף: שם data-mode ו-data-accent על התגית <html>,
// וה-CSS כבר יודע אילו צבעים להציג לפיהם
function applyAppearance(appearance) {
  const dark = appearance.theme === 'dark' || (appearance.theme === 'auto' && systemPrefersDark());
  document.documentElement.dataset.mode = dark ? 'dark' : 'light';
  document.documentElement.dataset.accent = appearance.accent;
}

// ברכה לפי השעה ביום
function timeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'בוקר טוב';
  if (hour >= 12 && hour < 17) return 'צהריים טובים';
  if (hour >= 17 && hour < 21) return 'ערב טוב';
  return 'לילה טוב';
}

// הכותרת: ברכה עם השם אם הוא נשמר, ואחרת "המנויים שלי"
function renderHeader() {
  pageTitle.textContent = settings.name ? `${timeGreeting()}, ${settings.name}` : 'המנויים שלי';
}

// ===== חישובים =====

// כמה יירד מהחשבון בחיוב הבא. אם הוגדר "מחיר בחידוש" (למשל אחרי מבצע), זה הסכום
function nextChargeAmount(sub) {
  return sub.renewalPrice > 0 ? sub.renewalPrice : sub.price;
}

// כמה מנוי עולה בשנה: המחיר כפול מספר החיובים בשנה
function yearlyCost(sub) {
  return sub.price * frequencyOf(sub).perYear;
}

// כמה מנוי עולה בחודש, בממוצע. למשל מנוי שנתי נספר כ-1/12 מהמחיר
function monthlyCost(sub) {
  const frequency = frequencyOf(sub);
  return frequency.perYear === 12 ? sub.price : yearlyCost(sub) / 12;
}

// מחשב את ההוצאה החודשית והשנתית של רשימת מנויים
function calcTotals(subscriptions) {
  let monthly = 0;
  let yearly = 0;

  for (const sub of subscriptions) {
    monthly += monthlyCost(sub);
    yearly += yearlyCost(sub);
  }

  return { monthly, yearly };
}

// ===== תאריכים =====

// הופך אובייקט Date למחרוזת בפורמט YYYY-MM-DD לפי השעון המקומי
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// מחזיר את התאריך של היום בפורמט YYYY-MM-DD
function todayString() {
  return formatDate(new Date());
}

// הופך מחרוזת YYYY-MM-DD לאובייקט Date מקומי (בלי בעיות של אזורי זמן)
function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// כמה ימים נשארו עד התאריך (מספר שלילי אם הוא כבר עבר)
function daysUntil(dateString) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = parseDate(dateString) - parseDate(todayString());
  return Math.round(diff / msPerDay);
}

// טקסט קצר על כמה זמן נשאר: "היום", "מחר" או "בעוד 5 ימים"
function describeRelative(dateString) {
  const days = daysUntil(dateString);
  if (days === 0) return 'היום';
  if (days === 1) return 'מחר';
  if (days === 2) return 'בעוד יומיים';
  return `בעוד ${days} ימים`;
}

// לדוגמה: "בעוד 5 ימים · 25 בנוב׳". השנה מופיעה רק אם היא לא השנה הנוכחית
function describeDate(dateString) {
  const date = parseDate(dateString);
  const options = { day: 'numeric', month: 'short' };
  if (date.getFullYear() !== new Date().getFullYear()) {
    options.year = 'numeric';
  }
  return `${describeRelative(dateString)} · ${date.toLocaleDateString('he-IL', options)}`;
}

// ===== קידום תאריכים אוטומטי =====

// כמה ימים יש בחודש מסוים (month מ-0 עד 11).
// טריק: היום ה-0 של החודש הבא הוא היום האחרון של החודש הזה
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// מוסיף חודשים לתאריך ומחזיר מחרוזת YYYY-MM-DD.
// billingDay הוא היום בחודש שבו המנוי מחויב בדרך כלל (למשל 31).
// אם היום הזה לא קיים בחודש החדש (31 בפברואר), לוקחים את היום האחרון בחודש
function addMonths(dateString, months, billingDay) {
  const date = parseDate(dateString);
  const totalMonths = date.getMonth() + months;
  const year = date.getFullYear() + Math.floor(totalMonths / 12);
  const month = totalMonths % 12;
  const day = Math.min(billingDay, daysInMonth(year, month));
  return formatDate(new Date(year, month, day));
}

// מוסיף ימים לתאריך ומחזיר מחרוזת YYYY-MM-DD
function addDays(dateString, days) {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// עובר על כל המנויים. אם תאריך החיוב כבר עבר, מקדם אותו
// בחודש (או בשנה) שוב ושוב, עד שהוא היום או בעתיד.
// מחזיר true אם משהו השתנה, כדי שנדע שצריך לשמור
function advancePastDates(subscriptions) {
  const today = todayString();
  let changed = false;

  for (const sub of subscriptions) {
    // מנויים ישנים שנשמרו לפני שהוספנו את billingDay: לוקחים את היום מהתאריך
    const billingDay = sub.billingDay || parseDate(sub.nextDate).getDate();
    const frequency = frequencyOf(sub);

    while (sub.nextDate < today) {
      // שבועי: מוסיפים 7 ימים. כל השאר: מוסיפים חודשים
      sub.nextDate =
        frequency.months === 0
          ? addDays(sub.nextDate, 7)
          : addMonths(sub.nextDate, frequency.months, billingDay);

      // החיוב קרה: מעכשיו המחיר הוא מחיר החידוש (אם היה),
      // וההחלטה "לחדש או לבטל" מתחילה מחדש לקראת החידוש הבא
      if (sub.renewalPrice > 0) {
        sub.price = sub.renewalPrice;
        sub.renewalPrice = 0;
      }
      sub.renewDecision = '';
      changed = true;
    }
  }

  return changed;
}

// ===== קטגוריות וצבעים =====

// השם שמוצג לקטגוריה. מנוי בלי קטגוריה מוצג כ"ללא קטגוריה"
function categoryLabel(category) {
  return category || 'ללא קטגוריה';
}

// בוחר גוון לקטגוריה חדשה: הגוון שהכי פחות קטגוריות משתמשות בו,
// כדי שהצבעים יהיו כמה שיותר שונים זה מזה
function pickTone(categories) {
  const counts = new Array(TONE_COUNT).fill(0);
  for (const category of categories) {
    counts[category.tone] += 1;
  }
  return counts.indexOf(Math.min(...counts));
}

// גוון "גיבוי" לקטגוריה שעוד לא נשמרה (למשל בזמן שמקלידים אותה בטופס).
// מחברים את מספרי האותיות של השם, כך שאותו שם מקבל תמיד אותו גוון
function hashTone(text) {
  let sum = 0;
  for (const char of text) {
    sum += char.codePointAt(0);
  }
  return sum % TONE_COUNT;
}

// מחזיר את שם המחלקה (class) של הצבע לקטגוריה, למשל "tone-2"
function toneClass(category) {
  if (!category) return 'tone-none';
  const found = settings.categories.find((c) => c.name === category);
  return `tone-${found ? found.tone : hashTone(category)}`;
}

// מוודא שכל קטגוריה שמנוי משתמש בה נמצאת ברשימת הקטגוריות בהגדרות.
// כך קטגוריה חדשה שהוקלדה בטופס מקבלת צבע קבוע משלה
function ensureCategories(subscriptions) {
  let changed = false;

  for (const sub of subscriptions) {
    if (sub.category && !settings.categories.some((c) => c.name === sub.category)) {
      settings.categories.push({ name: sub.category, tone: pickTone(settings.categories) });
      changed = true;
    }
  }

  if (changed) saveSettings(settings);
}

// ממלא את ההצעות של שדה הקטגוריה בטופס המנוי
function renderCategoryOptions() {
  categoryOptions.innerHTML = '';
  for (const category of settings.categories) {
    const option = document.createElement('option');
    option.value = category.name;
    categoryOptions.appendChild(option);
  }
}

// ===== ציור המסך =====

// מצייר מחדש את כל המסך לפי הנתונים השמורים
function render() {
  const subscriptions = loadSubscriptions();

  // לפני הציור: מקדמים תאריכים שעברו, ושומרים אם משהו השתנה
  if (advancePastDates(subscriptions)) {
    saveSubscriptions(subscriptions);
  }

  ensureCategories(subscriptions);

  // מיון לפי תאריך החיוב הבא, מהקרוב לרחוק.
  // מחרוזות בפורמט YYYY-MM-DD אפשר להשוות ישירות כטקסט
  subscriptions.sort((a, b) => a.nextDate.localeCompare(b.nextDate));

  renderHeader();

  // כפתורי הסינון. הפונקציה גם מאפסת את הבחירה אם הקטגוריה כבר לא קיימת
  renderFilter(subscriptions);

  // ברשימה מציגים רק את המנויים של הקטגוריה שנבחרה.
  // הסיכום, התזכורת והתובנות ממשיכים לחשב את כל המנויים
  const visible =
    selectedCategory === null
      ? subscriptions
      : subscriptions.filter((sub) => (sub.category || '') === selectedCategory);

  list.innerHTML = '';

  for (const sub of visible) {
    list.appendChild(createCard(sub));
  }

  emptyMessage.hidden = subscriptions.length > 0;
  exampleBanner.hidden = !subscriptions.some((sub) => sub.example);

  const totals = calcTotals(subscriptions);
  monthlyTotalEl.textContent = formatPrice(totals.monthly);
  yearlyTotalEl.textContent = formatPrice(totals.yearly);

  const count = subscriptions.length;
  subscriptionCountEl.textContent =
    count === 0 ? 'אין מנויים' : count === 1 ? 'מנוי אחד' : `${count} מנויים`;

  renderBudget(totals.monthly);
  renderBreakdown(subscriptions, totals.monthly);
  renderUpcoming(subscriptions);
  renderRenewalAlert(subscriptions);
  renderRenewals(subscriptions);
  renderInsights(subscriptions);
  renderSavings(subscriptions);
  renderCategoryOptions();
}

// ===== פירוט ההוצאה לפי מנוי =====

// מצייר את הפירוט שבכרטיס הסיכום: כל המנויים, מתי הם מחויבים וכמה.
// הרשימה שמגיעה לכאן כבר ממוינת לפי תאריך החיוב הבא
function renderBreakdown(subscriptions, monthlyTotal) {
  breakdownEl.hidden = subscriptions.length === 0;
  breakdownBody.innerHTML = '';
  if (subscriptions.length === 0) return;

  // קבוצה לכל תדירות שיש בה מנויים, לפי הסדר: חודשיים, שבועיים, דו-חודשיים, רבעוניים, שנתיים
  for (const key of ['monthly', 'weekly', 'bimonthly', 'quarterly', 'yearly']) {
    const inGroup = subscriptions.filter((sub) => frequencyOf(sub) === FREQUENCIES[key]);
    if (inGroup.length === 0) continue;
    const title = key === 'monthly' ? FREQUENCIES[key].group : `${FREQUENCIES[key].group}, בחישוב חודשי`;
    breakdownBody.appendChild(createBreakdownGroup(title, inGroup));
  }

  // הסה"כ שווה בדיוק להוצאה החודשית שבראש הכרטיס
  const total = document.createElement('div');
  total.className = 'breakdown-total';
  const label = document.createElement('span');
  label.textContent = 'סה"כ לחודש';
  const amount = document.createElement('span');
  amount.textContent = formatPrice(monthlyTotal);
  total.append(label, amount);
  breakdownBody.appendChild(total);
}

// קבוצה אחת בפירוט (למשל חודשיים): כותרת עם הסכום שלה, ושורה לכל מנוי
function createBreakdownGroup(title, subscriptions) {
  const group = document.createElement('section');
  group.className = 'breakdown-group';

  const heading = document.createElement('h3');
  heading.className = 'breakdown-group-title';
  const titleText = document.createElement('span');
  titleText.textContent = title;
  const groupSum = document.createElement('span');
  groupSum.textContent = `${formatPrice(calcTotals(subscriptions).monthly)} לחודש`;
  heading.append(titleText, groupSum);

  const rows = document.createElement('ul');
  rows.className = 'breakdown-list';
  for (const sub of subscriptions) {
    rows.appendChild(createBreakdownRow(sub));
  }

  group.append(heading, rows);
  return group;
}

// שורה אחת: שם, מתי מחויב, וכמה
function createBreakdownRow(sub) {
  const row = document.createElement('li');
  row.className = 'breakdown-row';

  const main = document.createElement('div');
  main.className = 'breakdown-main';

  const name = document.createElement('span');
  name.className = 'breakdown-name';
  name.textContent = isolate(sub.name);

  // חודשי: באיזה יום בחודש הוא יורד. שבועי: באיזה יום בשבוע.
  // כל השאר: התאריך המלא של החיוב הבא
  const frequency = frequencyOf(sub);
  const when = document.createElement('span');
  when.className = 'breakdown-when';
  if (frequency === FREQUENCIES.monthly) {
    const day = sub.billingDay || parseDate(sub.nextDate).getDate();
    when.textContent = `כל ${day} בחודש · הבא: ${describeRelative(sub.nextDate)}`;
  } else if (frequency === FREQUENCIES.weekly) {
    const weekday = parseDate(sub.nextDate).toLocaleDateString('he-IL', { weekday: 'long' });
    when.textContent = `כל שבוע, ${weekday} · הבא: ${describeRelative(sub.nextDate)}`;
  } else {
    when.textContent = `${frequency.every} · ${describeDate(sub.nextDate)}`;
  }

  main.append(name, when);

  const amount = document.createElement('span');
  amount.className = 'breakdown-amount';
  amount.textContent = formatPrice(monthlyCost(sub));

  // במנוי שאינו חודשי מראים גם את הסכום שבאמת יורד בכל חיוב
  if (frequency !== FREQUENCIES.monthly) {
    const realPrice = document.createElement('small');
    realPrice.textContent = `${formatPrice(sub.price)} ${frequency.per}`;
    amount.appendChild(realPrice);
  }

  row.append(main, amount);
  return row;
}

// ===== תקציב חודשי =====

// מצייר את פס התקציב בכרטיס הסיכום. מוסתר אם לא הוגדר תקציב
function renderBudget(monthly) {
  const budget = settings.budget;
  budgetEl.hidden = !(budget > 0);
  if (!(budget > 0)) return;

  const share = monthly / budget;
  const over = monthly > budget;

  // הפס מתמלא עד 100%, גם אם יש חריגה
  budgetFill.style.width = `${Math.min(share, 1) * 100}%`;
  budgetEl.classList.toggle('over', over);

  budgetText.textContent = over
    ? `חריגה של ${formatPrice(monthly - budget)} מהתקציב החודשי (${formatPrice(budget)})`
    : `${Math.round(share * 100)}% מהתקציב (${formatPrice(budget)}) · נשארו ${formatPrice(budget - monthly)}`;
}

// ===== סינון לפי קטגוריה =====

// מצייר את כפתורי הסינון: "הכל", ואחריו כפתור לכל קטגוריה עם ההוצאה החודשית שלה
function renderFilter(subscriptions) {
  // Set שומר כל ערך פעם אחת בלבד, וכך מקבלים רשימת קטגוריות בלי כפילויות
  const categories = [...new Set(subscriptions.map((sub) => sub.category || ''))];

  // מיון לפי א"ב, ו"ללא קטגוריה" תמיד בסוף
  categories.sort((a, b) => {
    if (a === '') return 1;
    if (b === '') return -1;
    return a.localeCompare(b, 'he');
  });

  // אם הקטגוריה שנבחרה נעלמה (למשל מחקנו את המנוי האחרון בה), חוזרים ל"הכל"
  if (selectedCategory !== null && !categories.includes(selectedCategory)) {
    selectedCategory = null;
  }

  // עם פחות משתי קטגוריות אין מה לסנן, אז מסתירים את השורה
  categoryFilter.hidden = categories.length < 2;

  categoryFilter.innerHTML = '';
  categoryFilter.appendChild(createFilterButton('הכל', null, ''));

  for (const category of categories) {
    const inCategory = subscriptions.filter((sub) => (sub.category || '') === category);
    const monthly = calcTotals(inCategory).monthly;
    categoryFilter.appendChild(
      createFilterButton(categoryLabel(category), category, `${formatPrice(monthly)} לחודש`)
    );
  }
}

// יוצר כפתור סינון אחד. value הוא הקטגוריה שהכפתור בוחר (null עבור "הכל")
function createFilterButton(label, value, amountText) {
  const button = document.createElement('button');
  button.className = 'chip';

  // aria-pressed מסמן איזה כפתור בחור. גם קוראי מסך וגם ה-CSS משתמשים בו
  button.setAttribute('aria-pressed', String(selectedCategory === value));

  // נקודה קטנה בצבע הקטגוריה (לא בכפתור "הכל")
  if (value !== null) {
    const dot = document.createElement('span');
    dot.className = `chip-dot ${toneClass(value)}`;
    button.appendChild(dot);
  }

  const name = document.createElement('span');
  name.textContent = isolate(label);
  button.appendChild(name);

  if (amountText) {
    const amount = document.createElement('span');
    amount.className = 'chip-amount';
    amount.textContent = amountText;
    button.appendChild(amount);
  }

  button.addEventListener('click', () => {
    selectedCategory = value;
    render();
  });

  return button;
}

// ===== תזכורת לחיובים קרובים =====

const UPCOMING_TITLES = {
  3: 'חיובים ב-3 הימים הקרובים',
  7: 'חיובים בשבוע הקרוב',
  14: 'חיובים בשבועיים הקרובים',
};

// מצייר את תיבת התזכורת: המנויים שמחויבים מהיום ועד מספר הימים שנבחר בהגדרות.
// הרשימה שמגיעה לכאן כבר ממוינת לפי תאריך
function renderUpcoming(subscriptions) {
  const days = settings.upcomingDays;
  const upcoming = subscriptions.filter((sub) => daysUntil(sub.nextDate) <= days);

  upcomingTitle.textContent = UPCOMING_TITLES[days];

  // אין חיובים קרובים? מסתירים את התיבה
  upcomingSection.hidden = upcoming.length === 0;

  upcomingList.innerHTML = '';
  let total = 0;

  for (const sub of upcoming) {
    const item = document.createElement('li');

    // שם המנוי, ולידו בצבע עדין מתי הוא יחויב
    const name = document.createElement('span');
    const when = document.createElement('span');
    when.className = 'upcoming-when';
    when.textContent = describeRelative(sub.nextDate);
    name.append(`${isolate(sub.name)} `, when);

    const price = document.createElement('span');
    price.className = 'upcoming-price';
    price.textContent = formatPrice(nextChargeAmount(sub));

    item.append(name, price);
    upcomingList.appendChild(item);

    // כאן סוכמים את המחיר המלא, כי זה הסכום שבאמת יירד מהחשבון
    total += nextChargeAmount(sub);
  }

  upcomingTotalEl.textContent = formatPrice(total);
}

// ===== תובנות =====

// מצייר את התובנות. מוצג רק כשיש לפחות שני מנויים
function renderInsights(subscriptions) {
  insightsList.innerHTML = '';
  insightsSection.hidden = subscriptions.length < 2;
  if (subscriptions.length < 2) return;

  for (const insight of buildInsights(subscriptions)) {
    insightsList.appendChild(createInsight(insight));
  }
}

// מחשב את התובנות. כל תובנה היא: אייקון, סוג (להדגשה), וחלקי טקסט.
// חלק שכתוב כ-{ b: '...' } יוצג מודגש
function buildInsights(subscriptions) {
  const insights = [];
  const totals = calcTotals(subscriptions);

  // (מנויים שכמעט לא בשימוש מופיעים ב"הצעות לחיסכון")

  // 1. חיוב רבעוני שמתקרב (בחודש הקרוב), כדי שלא יפתיע.
  // (לחידושים שנתיים יש אזור ותזכורת משלהם)
  const bigChargeSoon = subscriptions.find(
    (sub) => frequencyOf(sub) === FREQUENCIES.quarterly && daysUntil(sub.nextDate) <= 30
  );
  if (bigChargeSoon) {
    insights.push({
      icon: 'calendar',
      parts: [
        `החיוב ${frequencyOf(bigChargeSoon).adjective} של `,
        { b: bigChargeSoon.name },
        ' (',
        { b: formatPrice(bigChargeSoon.price) },
        `) מגיע ${describeRelative(bigChargeSoon.nextDate)}`,
      ],
    });
  }

  // 2. על איזו קטגוריה הולך הכי הרבה כסף
  const byCategory = new Map();
  for (const sub of subscriptions) {
    const key = sub.category || '';
    byCategory.set(key, (byCategory.get(key) || 0) + monthlyCost(sub));
  }
  if (byCategory.size >= 2 && totals.monthly > 0) {
    const [topCategory, topAmount] = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
    const percent = Math.round((topAmount / totals.monthly) * 100);
    insights.push({
      icon: 'pie',
      parts: ['הכי הרבה כסף הולך על ', { b: topCategory || 'מנויים בלי קטגוריה' }, ': ', { b: `${percent}%` }, ' מההוצאה החודשית'],
    });
  }

  // 3. המנוי הכי יקר (בחישוב חודשי)
  const priciest = subscriptions.reduce((a, b) => (monthlyCost(b) > monthlyCost(a) ? b : a));
  insights.push({
    icon: 'trending',
    parts: [
      'המנוי הכי יקר שלך הוא ',
      { b: priciest.name },
      ': ',
      { b: formatPrice(monthlyCost(priciest)) },
      frequencyOf(priciest) === FREQUENCIES.monthly ? ' לחודש' : ' לחודש (בחישוב חודשי)',
    ],
  });

  // 4. כמה עולים כל המנויים ביחד ליום
  insights.push({
    icon: 'coffee',
    parts: ['בממוצע, כל המנויים שלך ביחד עולים ', { b: formatPrice(totals.yearly / 365) }, ' ליום'],
  });

  return insights;
}

// יוצר שורת תובנה אחת. הטקסט נבנה עם textContent, כדי ששמות של מנויים יוצגו כמו שהם
function createInsight(insight) {
  const item = document.createElement('li');
  item.className = insight.type ? `insight ${insight.type}` : 'insight';

  const icon = document.createElement('span');
  icon.className = 'insight-icon';
  icon.innerHTML = svgIcon(UI_ICONS[insight.icon], 18);

  const text = document.createElement('p');
  text.className = 'insight-text';
  for (const part of insight.parts) {
    if (typeof part === 'string') {
      text.append(part);
    } else {
      const strong = document.createElement('strong');
      strong.textContent = isolate(part.b);
      text.append(strong);
    }
  }

  item.append(icon, text);
  return item;
}

// ===== חידושים שנתיים =====

// תאריך קצר, למשל "28 בנוב׳". השנה מופיעה רק אם היא לא השנה הנוכחית
function shortDate(dateString) {
  const date = parseDate(dateString);
  const options = { day: 'numeric', month: 'short' };
  if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
  return date.toLocaleDateString('he-IL', options);
}

// האם חידוש שנתי כבר בתוך תקופת התזכורת שנבחרה בהגדרות
function renewalIsNear(sub) {
  return daysUntil(sub.nextDate) <= settings.renewalNotice;
}

// הפס בראש המסך: חידושים שנתיים שמתקרבים ועוד דורשים משהו ממך
// (שעוד לא החלטת לגביהם, או שהחלטת לבטל)
function renderRenewalAlert(subscriptions) {
  const due = subscriptions.filter(
    (sub) =>
      frequencyOf(sub) === FREQUENCIES.yearly && renewalIsNear(sub) && sub.renewDecision !== 'renew'
  );

  renewalAlert.hidden = due.length === 0;
  renewalAlertList.innerHTML = '';
  if (due.length === 0) return;

  renewalAlertTitle.textContent =
    due.length === 1 ? 'חידוש שנתי מתקרב' : `${due.length} חידושים שנתיים מתקרבים`;

  for (const sub of due) {
    const item = document.createElement('li');
    if (sub.renewDecision === 'cancel') {
      item.textContent = `לבטל את ${isolate(sub.name)} לפני ${shortDate(sub.nextDate)} (${describeRelative(sub.nextDate)})`;
      item.className = 'danger-text';
    } else {
      let text = `${isolate(sub.name)}: ${describeRelative(sub.nextDate)}, ${formatPrice(nextChargeAmount(sub))}`;
      if (sub.renewalPrice > sub.price) text += ` (המחיר עולה מ-${formatPrice(sub.price)})`;
      item.textContent = text;
    }
    renewalAlertList.appendChild(item);
  }
}

// האזור "חידושים שנתיים": כל המנויים השנתיים, מהקרוב לרחוק
function renderRenewals(subscriptions) {
  const yearly = subscriptions.filter((sub) => frequencyOf(sub) === FREQUENCIES.yearly);

  renewalsSection.hidden = yearly.length === 0;
  renewalsList.innerHTML = '';
  if (yearly.length === 0) return;

  const total = yearly.reduce((sum, sub) => sum + nextChargeAmount(sub), 0);
  renewalsTotal.textContent = `${formatPrice(total)} בשנה`;

  for (const sub of yearly) {
    renewalsList.appendChild(createRenewalItem(sub));
  }
}

// כרטיס של חידוש שנתי אחד
function createRenewalItem(sub) {
  const days = daysUntil(sub.nextDate);
  const near = renewalIsNear(sub);
  const decision = sub.renewDecision || '';

  const item = document.createElement('li');
  item.className = 'renewal';
  if (near) item.classList.add('near');

  // שורה עליונה: אייקון, שם ותאריך, סכום
  const top = document.createElement('div');
  top.className = 'renewal-top';

  const avatar = document.createElement('div');
  avatar.className = `renewal-avatar ${toneClass(sub.category)}`;
  avatar.setAttribute('aria-hidden', 'true');
  if (hasIcon(sub.icon)) {
    avatar.innerHTML = svgIcon(ICONS[sub.icon].svg, 20);
  } else {
    avatar.textContent = (Array.from(sub.name)[0] || '?').toUpperCase();
  }

  const main = document.createElement('div');
  main.className = 'renewal-main';
  const name = document.createElement('h3');
  name.className = 'renewal-name';
  name.textContent = isolate(sub.name);
  const when = document.createElement('span');
  when.className = 'renewal-date';
  when.textContent = `${shortDate(sub.nextDate)} · ${describeRelative(sub.nextDate)}`;
  main.append(name, when);

  const amount = document.createElement('span');
  amount.className = 'renewal-amount';
  amount.textContent = formatPrice(nextChargeAmount(sub));

  top.append(avatar, main, amount);
  item.appendChild(top);

  // פס: כמה מהשנה כבר עברה עד החידוש
  const bar = document.createElement('div');
  bar.className = 'renewal-bar';
  bar.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  const passed = Math.min(Math.max((365 - days) / 365, 0), 1);
  fill.style.width = `${passed * 100}%`;
  bar.appendChild(fill);
  item.appendChild(bar);

  // הערות: מחיר שעולה בחידוש, ומה צריך לעשות
  const notes = [];
  if (sub.renewalPrice > 0 && sub.renewalPrice !== sub.price) {
    const direction = sub.renewalPrice > sub.price ? 'עולה' : 'יורד';
    notes.push({ text: `המחיר ${direction} בחידוש: מ-${formatPrice(sub.price)} ל-${formatPrice(sub.renewalPrice)}`, type: 'warn' });
  }
  if (decision === 'cancel') {
    notes.push({ text: `לבטל לפני ${shortDate(sub.nextDate)}, כדי שלא תחויב`, type: 'danger' });
  } else if (decision === '' && near) {
    notes.push({ text: `כדאי להחליט עד ${shortDate(sub.nextDate)}: לחדש או לבטל?`, type: 'warn' });
  }
  for (const note of notes) {
    const line = document.createElement('p');
    line.className = `renewal-note ${note.type}`;
    line.textContent = note.text;
    item.appendChild(line);
  }

  // בחירה: אחדש / אבטל / עוד לא החלטתי
  const choices = document.createElement('div');
  choices.className = 'segmented compact renewal-decision';
  choices.setAttribute('role', 'radiogroup');
  choices.setAttribute('aria-label', `מה לעשות בחידוש של ${sub.name}`);
  const options = [
    ['', 'עוד לא החלטתי'],
    ['renew', 'אחדש'],
    ['cancel', 'אבטל'],
  ];
  for (const [value, label] of options) {
    const option = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `decision-${sub.id}`;
    input.value = value;
    input.checked = decision === value;
    input.addEventListener('change', () => setRenewDecision(sub.id, value));
    const text = document.createElement('span');
    text.textContent = label;
    option.append(input, text);
    choices.appendChild(option);
  }
  item.appendChild(choices);

  return item;
}

// שומר את ההחלטה לגבי חידוש שנתי
function setRenewDecision(id, decision) {
  const subscriptions = loadSubscriptions();
  const sub = subscriptions.find((s) => s.id === id);
  if (!sub) return;
  sub.renewDecision = decision;
  saveSubscriptions(subscriptions);
  render();
  if (decision === 'cancel') showToast(`נרשם: לבטל את ${isolate(sub.name)} לפני ${shortDate(sub.nextDate)}`);
}

// שדה "מחיר בחידוש" מופיע בטופס רק כשהתדירות היא שנתית
function updateRenewalField() {
  renewalField.hidden = form.elements.frequency.value !== 'yearly';
}

// ===== הצעות לחיסכון =====

// אייקונים של שירותים שבדרך כלל לא צריך יותר מאחד מהם (למשל שני שירותי טלוויזיה)
const OVERLAP_ICONS = ['tv', 'film', 'music', 'headphones', 'cloud', 'book', 'news'];

// הנחה משוערת במעבר ממסלול חודשי לשנתי. זו רק הערכה לחישוב, לא מחיר אמיתי
const YEARLY_PLAN_DISCOUNT = 0.15;

// מצייר את ההצעות לחיסכון ואת המחשבון "מה אם אבטל?"
function renderSavings(subscriptions) {
  savingsSection.hidden = subscriptions.length === 0;
  savingsList.innerHTML = '';
  if (subscriptions.length === 0) return;

  for (const suggestion of buildSavings(subscriptions)) {
    savingsList.appendChild(createInsight(suggestion));
  }

  renderWhatIf(subscriptions);
}

// מצמיד אות עברית (כמו ל, ב, מ) לשם. לפני שם באנגלית או מספר מוסיפים מקף:
// "לחדר כושר", אבל "ל-Netflix"
function withPrefix(letter, name) {
  return /^[\u0590-\u05FF]/.test(name) ? `${letter}${name}` : `${letter}-${name}`;
}

// טקסט "X ₪ בחודש (Y ₪ בשנה)" כחלקים, כשהסכומים מודגשים
function savingParts(monthly) {
  return [{ b: formatPrice(monthly) }, ' בחודש (', { b: formatPrice(monthly * 12) }, ' בשנה)'];
}

// מחשב הצעות לחיסכון. כל הצעה בנויה כמו תובנה: אייקון, סוג וחלקי טקסט
function buildSavings(subscriptions) {
  const suggestions = [];
  const totals = calcTotals(subscriptions);

  // 1. מנויים שסימנת "כמעט לא בשימוש": כמה יחסוך ביטול של כל אחד
  const rarely = subscriptions.filter((sub) => sub.rarelyUsed);
  for (const sub of rarely) {
    suggestions.push({
      icon: 'scissors',
      type: 'highlight',
      parts: ['ביטול ', { b: sub.name }, ', שכמעט לא בשימוש, יחסוך לך ', ...savingParts(monthlyCost(sub))],
    });
  }

  // 2. כמה שירותים מאותו סוג (לפי האייקון): אם משאירים רק את הזול מביניהם
  for (const icon of OVERLAP_ICONS) {
    const same = subscriptions.filter((sub) => sub.icon === icon);
    if (same.length < 2) continue;

    const cheapest = same.reduce((a, b) => (monthlyCost(b) < monthlyCost(a) ? b : a));
    const saving = calcTotals(same).monthly - monthlyCost(cheapest);
    suggestions.push({
      icon: 'copy',
      parts: [
        'יש לך ',
        { b: `${same.length} שירותים מסוג "${ICONS[icon].label}"` },
        `: ${same.map((sub) => isolate(sub.name)).join(', ')}. אם תשאיר רק את `,
        { b: cheapest.name },
        ', תחסוך ',
        ...savingParts(saving),
      ],
    });
  }

  // 3. מעבר למסלול שנתי: על המנוי החודשי הכי יקר שאתה כן משתמש בו
  const monthlyInUse = subscriptions.filter(
    (sub) => frequencyOf(sub) === FREQUENCIES.monthly && !sub.rarelyUsed && sub.price >= 20
  );
  if (monthlyInUse.length > 0) {
    const top = monthlyInUse.reduce((a, b) => (b.price > a.price ? b : a));
    const yearlySaving = top.price * 12 * YEARLY_PLAN_DISCOUNT;
    suggestions.push({
      icon: 'percent',
      parts: [
        'לשירותים רבים יש מסלול שנתי בהנחה. אם ',
        { b: withPrefix('ל', top.name) },
        ` יש מסלול כזה עם ${Math.round(YEARLY_PLAN_DISCOUNT * 100)}% הנחה, תחסוך כ-`,
        { b: formatPrice(yearlySaving) },
        ' בשנה',
      ],
    });
  }

  // 4. חריגה מהתקציב: כמה צריך לחסוך כדי לחזור אליו
  if (settings.budget > 0 && totals.monthly > settings.budget) {
    suggestions.push({
      icon: 'target',
      type: 'highlight',
      parts: [
        'כדי לחזור לתקציב צריך לחסוך ',
        { b: formatPrice(totals.monthly - settings.budget) },
        ' בחודש. במחשבון למטה אפשר לבדוק אילו ביטולים יספיקו',
      ],
    });
  }

  // 5. טיפ, אם עוד לא סימנו אף מנוי כ"כמעט לא בשימוש"
  if (rarely.length === 0) {
    suggestions.push({
      icon: 'bulb',
      type: 'tip',
      parts: ['טיפ: בעריכת מנוי אפשר לסמן "כמעט לא", ויופיע כאן כמה תחסוך אם תבטל אותו'],
    });
  }

  return suggestions;
}

// ===== מחשבון "מה אם אבטל?" =====

// המנויים שמסומנים כרגע במחשבון (לפי id). נשמר רק בזמן שהדף פתוח
const whatIfSelected = new Set();
let whatIfStarted = false;

// מצייר את רשימת הסימון של המחשבון, מהמנוי הכי יקר לזול
function renderWhatIf(subscriptions) {
  // בפעם הראשונה מסמנים מראש את המנויים שכמעט לא בשימוש
  if (!whatIfStarted) {
    subscriptions.filter((sub) => sub.rarelyUsed).forEach((sub) => whatIfSelected.add(sub.id));
    whatIfStarted = true;
  }

  // מנויים שנמחקו יוצאים מהסימון
  const ids = new Set(subscriptions.map((sub) => sub.id));
  for (const id of [...whatIfSelected]) {
    if (!ids.has(id)) whatIfSelected.delete(id);
  }

  whatIfList.innerHTML = '';
  const byCost = [...subscriptions].sort((a, b) => monthlyCost(b) - monthlyCost(a));

  for (const sub of byCost) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'whatif-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = whatIfSelected.has(sub.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) whatIfSelected.add(sub.id);
      else whatIfSelected.delete(sub.id);
      renderWhatIfResult(subscriptions);
    });

    const name = document.createElement('span');
    name.className = 'whatif-name';
    name.textContent = isolate(sub.name);

    const amount = document.createElement('span');
    amount.className = 'whatif-amount';
    amount.textContent = `${formatPrice(monthlyCost(sub))} לחודש`;

    label.append(checkbox, name, amount);
    item.appendChild(label);
    whatIfList.appendChild(item);
  }

  renderWhatIfResult(subscriptions);
}

// מחשב ומציג כמה יחסוך ביטול המנויים המסומנים
function renderWhatIfResult(subscriptions) {
  whatIfResult.innerHTML = '';
  const chosen = subscriptions.filter((sub) => whatIfSelected.has(sub.id));

  if (chosen.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'whatif-hint';
    hint.textContent = 'סמן מנוי אחד או יותר כדי לראות כמה תחסוך';
    whatIfResult.appendChild(hint);
    return;
  }

  const saving = calcTotals(chosen).monthly;
  const before = calcTotals(subscriptions).monthly;
  const after = before - saving;

  const main = document.createElement('p');
  main.className = 'whatif-main';
  const who = chosen.length === 1 ? `ביטול ${isolate(chosen[0].name)}` : `ביטול ${chosen.length} מנויים`;
  main.append(`${who} יחסוך `);
  const monthlyStrong = document.createElement('strong');
  monthlyStrong.textContent = `${formatPrice(saving)} בחודש`;
  main.append(monthlyStrong, ' · ');
  const yearlyStrong = document.createElement('strong');
  yearlyStrong.textContent = `${formatPrice(saving * 12)} בשנה`;
  main.append(yearlyStrong);

  const detail = document.createElement('p');
  detail.className = 'whatif-detail';
  let text = `ההוצאה החודשית תרד מ-${formatPrice(before)} ל-${formatPrice(after)}`;
  if (settings.budget > 0) {
    text += after <= settings.budget
      ? ', בתוך התקציב'
      : `, עדיין ${formatPrice(after - settings.budget)} מעל התקציב`;
  }
  detail.textContent = text;

  whatIfResult.append(main, detail);
}

// ===== כרטיס מנוי =====

// יוצר כרטיס של מנוי אחד מתוך התבנית שב-HTML
function createCard(sub) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const tone = toneClass(sub.category);

  // משתמשים ב-textContent (ולא innerHTML) כדי שטקסט של המשתמש יוצג כמו שהוא

  // העיגול: האייקון שנבחר, או האות הראשונה של השם. הכול בצבע של הקטגוריה.
  // Array.from מפרק נכון גם תווים מיוחדים, שתופסים יותר מתו אחד
  const avatar = card.querySelector('.avatar');
  if (hasIcon(sub.icon)) {
    avatar.innerHTML = svgIcon(ICONS[sub.icon].svg, 24);
  } else {
    avatar.textContent = (Array.from(sub.name)[0] || '?').toUpperCase();
  }
  avatar.classList.add(tone);

  card.querySelector('.card-name').textContent = isolate(sub.name);

  const categoryTag = card.querySelector('.card-category');
  categoryTag.textContent = sub.category || '';
  categoryTag.classList.add(tone);

  // תגית למנוי שכמעט לא משתמשים בו
  if (sub.rarelyUsed) {
    const usageTag = document.createElement('span');
    usageTag.className = 'tag usage-tag';
    usageTag.textContent = 'כמעט לא בשימוש';
    card.querySelector('.card-heading').appendChild(usageTag);
  }

  card.querySelector('.card-amount').textContent = formatPrice(sub.price);
  card.querySelector('.card-frequency').textContent = frequencyOf(sub).per;

  const dateEl = card.querySelector('.card-date');
  dateEl.textContent = describeDate(sub.nextDate);
  if (daysUntil(sub.nextDate) <= SOON_DAYS) {
    dateEl.classList.add('soon');
  }

  card.querySelector('.card-notes').textContent = sub.notes || '';

  // לכפתורי האייקון אין טקסט, אז נותנים להם שם לקוראי מסך (וגם טיפ במעבר עכבר)
  const editButton = card.querySelector('.edit-button');
  editButton.setAttribute('aria-label', `עריכת ${sub.name}`);
  editButton.title = 'עריכה';
  editButton.addEventListener('click', () => openForm(sub));

  const deleteButton = card.querySelector('.delete-button');
  deleteButton.setAttribute('aria-label', `מחיקת ${sub.name}`);
  deleteButton.title = 'מחיקה';
  deleteButton.addEventListener('click', () => deleteSubscription(sub));

  return card;
}

// ===== בחירת אייקון בטופס =====

// הכפתור "בלי אייקון" מציג את האות הראשונה של השם. שומרים אותו כדי לעדכן אותו
let noIconFace = null;

// בונה פעם אחת את כפתורי האייקונים בטופס (כפתורי רדיו בשם "icon")
function buildIconPicker() {
  const options = [['', null], ...Object.entries(ICONS)];

  for (const [id, icon] of options) {
    const label = document.createElement('label');
    label.className = 'icon-option';
    label.title = icon ? icon.label : 'בלי אייקון (האות הראשונה של השם)';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'icon';
    input.value = id;
    input.setAttribute('aria-label', label.title);
    // "בלי אייקון" הוא ברירת המחדל, ו-form.reset() חוזר אליו
    if (id === '') input.defaultChecked = true;

    const face = document.createElement('span');
    if (icon) {
      face.innerHTML = svgIcon(icon.svg, 22);
    } else {
      face.textContent = 'א';
      noIconFace = face;
    }

    label.append(input, face);
    iconPicker.appendChild(label);
  }
}

// האייקונים בטופס נצבעים בצבע של הקטגוריה שכתובה כרגע בשדה
function updateIconPickerTone() {
  iconPicker.className = `icon-picker ${toneClass(form.elements.category.value.trim())}`;
}

// מעדכן את האות בכפתור "בלי אייקון" לפי השם שמוקלד
function updateNoIconLetter() {
  const firstChar = Array.from(form.elements.name.value.trim())[0];
  noIconFace.textContent = firstChar ? firstChar.toUpperCase() : 'א';
}

// ===== טופס המנוי =====

// פותח את הטופס. בלי מנוי: טופס ריק להוספה. עם מנוי: טופס ממולא לעריכה
function openForm(sub) {
  form.reset();

  if (sub) {
    editingId = sub.id;
    formTitle.textContent = 'עריכת מנוי';
    form.elements.name.value = sub.name;
    form.elements.price.value = sub.price;
    form.elements.frequency.value = sub.frequency;
    form.elements.nextDate.value = sub.nextDate;
    form.elements.category.value = sub.category || '';
    form.elements.icon.value = hasIcon(sub.icon) ? sub.icon : '';
    form.elements.usage.value = sub.rarelyUsed ? 'rarely' : 'used';
    form.elements.renewalPrice.value = sub.renewalPrice > 0 ? sub.renewalPrice : '';
    form.elements.notes.value = sub.notes || '';
  } else {
    editingId = null;
    formTitle.textContent = 'הוספת מנוי';
    form.elements.nextDate.value = todayString();
  }

  updateIconPickerTone();
  updateNoIconLetter();
  updateRenewalField();
  dialog.showModal();
}

// נקרא כשלוחצים "שמירה". הדפדפן כבר בדק את שדות החובה (בזכות required)
function handleSubmit(event) {
  event.preventDefault(); // מונע מהדף להיטען מחדש

  const subscriptions = loadSubscriptions();
  const oldSubscription = subscriptions.find((s) => s.id === editingId);
  const nextDate = form.elements.nextDate.value;

  // היום בחודש שבו המנוי מחויב. אם בעריכה לא שינו את התאריך, שומרים את היום הקודם.
  // כך מנוי שמחויב ב-31 לחודש חוזר ל-31 גם אחרי חודש קצר כמו פברואר
  const billingDay =
    oldSubscription && oldSubscription.nextDate === nextDate && oldSubscription.billingDay
      ? oldSubscription.billingDay
      : parseDate(nextDate).getDate();

  const icon = form.elements.icon.value;

  const subscription = {
    id: editingId || crypto.randomUUID(),
    name: form.elements.name.value.trim(),
    price: Number(form.elements.price.value),
    frequency: form.elements.frequency.value,
    nextDate,
    billingDay,
    category: form.elements.category.value.trim(),
    icon: hasIcon(icon) ? icon : '',
    rarelyUsed: form.elements.usage.value === 'rarely',
    notes: form.elements.notes.value.trim(),
    // מנוי דוגמה נשאר מנוי דוגמה גם אחרי עריכה, כדי ש"ניקוי הדוגמה" ימחק אותו
    example: Boolean(oldSubscription && oldSubscription.example),
    // מחיר בחידוש: רק למנוי שנתי, ורק אם הוא שונה מהמחיר הנוכחי
    renewalPrice: 0,
    // ההחלטה לגבי החידוש נשמרת גם אחרי עריכה
    renewDecision: (oldSubscription && oldSubscription.renewDecision) || '',
  };

  const renewalPrice = Number(form.elements.renewalPrice.value);
  if (subscription.frequency === 'yearly' && renewalPrice > 0 && renewalPrice !== subscription.price) {
    subscription.renewalPrice = renewalPrice;
  }

  if (!subscription.name || !(subscription.price > 0)) {
    showToast('יש למלא שם ומחיר גדול מאפס');
    return;
  }

  if (editingId) {
    // עריכה: מחליפים את המנוי הישן בחדש
    const index = subscriptions.findIndex((s) => s.id === editingId);
    subscriptions[index] = subscription;
  } else {
    // הוספה: מוסיפים לסוף הרשימה (המיון קורה ב-render)
    subscriptions.push(subscription);
  }

  saveSubscriptions(subscriptions);
  dialog.close();
  render();
}

// מוחק מנוי אחרי שהמשתמש מאשר
async function deleteSubscription(sub) {
  if (!(await askConfirm(`למחוק את "${isolate(sub.name)}"?`, 'מחיקה', true))) return;

  const remaining = loadSubscriptions().filter((s) => s.id !== sub.id);
  saveSubscriptions(remaining);
  render();
  showToast(`"${isolate(sub.name)}" נמחק`);
}

// ===== חלון ההגדרות =====

// פותח את חלון ההגדרות וממלא אותו בהגדרות השמורות
function openSettings() {
  settingsForm.reset();

  const fields = settingsForm.elements;
  fields.userName.value = settings.name;
  fields.accent.value = settings.accent;
  fields.theme.value = settings.theme;
  fields.upcomingDays.value = String(settings.upcomingDays);
  fields.renewalNotice.value = String(settings.renewalNotice);
  fields.budget.value = settings.budget > 0 ? settings.budget : '';

  // עובדים על עותק של הקטגוריות, כדי ש"ביטול" לא ישנה כלום
  draftCategories = settings.categories.map((category) => ({ ...category }));
  newCategoryInput.value = '';
  renderCategoryEditor();

  settingsDialog.showModal();
}

// קורא את מה שכתוב כרגע בחלון ההגדרות ומחזיר הגדרות תקינות
function readSettingsForm() {
  const fields = settingsForm.elements;
  return cleanSettings({
    name: fields.userName.value,
    accent: fields.accent.value,
    theme: fields.theme.value,
    upcomingDays: Number(fields.upcomingDays.value),
    renewalNotice: Number(fields.renewalNotice.value),
    budget: fields.budget.value,
    categories: draftCategories,
  });
}

// מצייר את רשימת הקטגוריות בחלון ההגדרות: שם, בחירת צבע וכפתור מחיקה
function renderCategoryEditor() {
  categoryEditor.innerHTML = '';

  if (draftCategories.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'category-empty';
    empty.textContent = 'אין עדיין קטגוריות. אפשר להוסיף למטה';
    categoryEditor.appendChild(empty);
    return;
  }

  draftCategories.forEach((category, index) => {
    const row = document.createElement('li');
    row.className = 'category-row';

    const name = document.createElement('span');
    name.className = 'category-row-name';
    name.textContent = isolate(category.name);

    // בחירת צבע: כפתור רדיו לכל גוון
    const picker = document.createElement('div');
    picker.className = 'tone-picker';
    picker.setAttribute('role', 'radiogroup');
    picker.setAttribute('aria-label', `צבע לקטגוריה ${category.name}`);

    for (let tone = 0; tone < TONE_COUNT; tone++) {
      const choice = document.createElement('label');
      choice.className = `tone-choice tone-${tone}`;
      choice.title = TONE_NAMES[tone];

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `category-tone-${index}`;
      input.value = String(tone);
      input.checked = category.tone === tone;
      input.setAttribute('aria-label', TONE_NAMES[tone]);
      input.addEventListener('change', () => {
        draftCategories[index].tone = tone;
      });

      const dot = document.createElement('span');
      dot.className = 'tone-dot';

      choice.append(input, dot);
      picker.appendChild(choice);
    }

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'icon-button danger';
    deleteButton.title = 'מחיקה';
    deleteButton.setAttribute('aria-label', `מחיקת הקטגוריה ${category.name}`);
    deleteButton.innerHTML = svgIcon(UI_ICONS.trash, 18);
    deleteButton.addEventListener('click', () => deleteDraftCategory(index));

    row.append(name, picker, deleteButton);
    categoryEditor.appendChild(row);
  });
}

// מוסיף קטגוריה חדשה לעותק העבודה
function addDraftCategory() {
  const name = newCategoryInput.value.trim();

  if (!name) {
    newCategoryInput.focus();
    return;
  }

  if (draftCategories.some((category) => category.name === name)) {
    showToast('הקטגוריה הזו כבר קיימת');
    return;
  }

  draftCategories.push({ name, tone: pickTone(draftCategories) });
  newCategoryInput.value = '';
  renderCategoryEditor();
}

// מוחק קטגוריה מעותק העבודה. אם יש לה מנויים, שואלים קודם
async function deleteDraftCategory(index) {
  const category = draftCategories[index];
  const inUse = loadSubscriptions().filter((sub) => sub.category === category.name).length;

  if (inUse > 0) {
    const who = inUse === 1 ? 'למנוי אחד' : `ל-${inUse} מנויים`;
    const ok = await askConfirm(
      `הקטגוריה "${isolate(category.name)}" משויכת ${who}. אחרי השמירה הם יישארו בלי קטגוריה. למחוק?`,
      'מחיקה',
      true
    );
    if (!ok) return;
  }

  draftCategories = draftCategories.filter((c) => c !== category);
  renderCategoryEditor();
}

// נקרא כשלוחצים "שמירה" בחלון ההגדרות
function handleSettingsSubmit(event) {
  event.preventDefault();

  const newSettings = readSettingsForm();

  // מנויים שהקטגוריה שלהם נמחקה נשארים בלי קטגוריה
  const keptNames = new Set(newSettings.categories.map((category) => category.name));
  const subscriptions = loadSubscriptions();
  let changed = false;

  for (const sub of subscriptions) {
    if (sub.category && !keptNames.has(sub.category)) {
      sub.category = '';
      changed = true;
    }
  }

  if (changed) saveSubscriptions(subscriptions);

  settings = newSettings;
  saveSettings(settings);
  settingsDialog.close();
  render();
}

// ===== גיבוי: ייצוא וייבוא =====

const exportDialog = document.getElementById('export-dialog');
const exportText = document.getElementById('export-text');
const importDialog = document.getElementById('import-dialog');
const importText = document.getElementById('import-text');
const importInput = document.getElementById('import-input');

// פותח את חלון הייצוא, עם כל המנויים וההגדרות כטקסט (JSON)
function openExport() {
  const subscriptions = loadSubscriptions();

  if (subscriptions.length === 0) {
    showToast('אין עדיין מנויים לייצא');
    return;
  }

  const backup = {
    app: 'מעקב מנויים',
    version: 2,
    exportedAt: new Date().toISOString(),
    subscriptions,
    settings,
  };

  // null, 2 מסדר את הטקסט בשורות עם הזחה, כדי שיהיה נוח לקרוא אותו
  exportText.value = JSON.stringify(backup, null, 2);
  exportDialog.showModal();
  exportText.scrollTop = 0;
}

// מעתיק את טקסט הגיבוי. אם הדפדפן לא מרשה, מסמן את הטקסט כדי להעתיק אותו ידנית
async function copyBackup() {
  try {
    await navigator.clipboard.writeText(exportText.value);
    showToast('הגיבוי הועתק');
  } catch (error) {
    exportText.focus();
    exportText.select();
    showToast('סימנתי את הטקסט. אפשר להעתיק אותו עם Ctrl+C (או Cmd+C ב-Mac)');
  }
}

// מוריד טקסט כקובץ: יוצרים קישור זמני לקובץ ו"לוחצים" עליו
function downloadFile(fileName, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  // משחררים את הקישור הזמני אחרי שההורדה התחילה
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// בודק שמנוי מהקובץ תקין ומחזיר גרסה נקייה שלו, או null אם משהו חסר או שגוי
function cleanSubscription(item) {
  if (!item || typeof item !== 'object') return null;

  const name = String(item.name ?? '').trim();
  const price = Number(item.price);
  const frequencyOk = typeof item.frequency === 'string' && Object.hasOwn(FREQUENCIES, item.frequency);

  // תאריך תקין: בפורמט YYYY-MM-DD, ותאריך שבאמת קיים (לא 31 בפברואר)
  const dateOk =
    typeof item.nextDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.nextDate) &&
    formatDate(parseDate(item.nextDate)) === item.nextDate;

  if (!name || !(price > 0) || !frequencyOk || !dateOk) return null;

  const billingDayOk =
    Number.isInteger(item.billingDay) && item.billingDay >= 1 && item.billingDay <= 31;

  return {
    id: typeof item.id === 'string' ? item.id : '',
    name,
    price,
    frequency: item.frequency,
    nextDate: item.nextDate,
    billingDay: billingDayOk ? item.billingDay : parseDate(item.nextDate).getDate(),
    category: String(item.category ?? '').trim(),
    icon: hasIcon(item.icon) ? item.icon : '',
    rarelyUsed: item.rarelyUsed === true,
    notes: String(item.notes ?? '').trim(),
    example: item.example === true,
    renewalPrice: Number(item.renewalPrice) > 0 ? Number(item.renewalPrice) : 0,
    renewDecision: RENEW_DECISIONS.includes(item.renewDecision) ? item.renewDecision : '',
  };
}

// פותח את חלון הייבוא
function openImport() {
  importText.value = '';
  importDialog.showModal();
}

// בודק טקסט של גיבוי, ומחליף בו את המנויים (וההגדרות, אם יש) אחרי אישור
async function importFromText(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    showToast('זה לא נראה כמו גיבוי. ודא שבחרת את הקובץ הנכון, או שהעתקת את כל הטקסט');
    return;
  }

  // מקבלים גם גיבוי של האפליקציה וגם רשימה פשוטה של מנויים
  const items = Array.isArray(data) ? data : data && data.subscriptions;

  if (!Array.isArray(items) || items.length === 0) {
    showToast('לא מצאתי מנויים בגיבוי הזה');
    return;
  }

  const imported = [];
  const usedIds = new Set();

  for (const item of items) {
    const sub = cleanSubscription(item);

    if (!sub) {
      showToast('יש בגיבוי מנוי עם נתונים חסרים או שגויים, ולכן לא ייבאתי כלום');
      return;
    }

    // לכל מנוי צריך מזהה ייחודי. אם חסר או כפול, יוצרים חדש
    if (!sub.id || usedIds.has(sub.id)) {
      sub.id = crypto.randomUUID();
    }
    usedIds.add(sub.id);
    imported.push(sub);
  }

  // גיבויים חדשים כוללים גם את ההגדרות האישיות
  const importedSettings =
    !Array.isArray(data) && data.settings && typeof data.settings === 'object'
      ? cleanSettings(data.settings)
      : null;

  // לפני שמחליפים משהו, אומרים בדיוק מה יוחלף
  const current = loadSubscriptions();
  const replaced = [];
  if (current.length === 1) replaced.push('את המנוי שיש עכשיו');
  if (current.length > 1) replaced.push(`את כל ${current.length} המנויים שיש עכשיו`);
  if (importedSettings) replaced.push('את ההגדרות האישיות');

  if (replaced.length > 0) {
    const inBackup = imported.length === 1 ? 'מנוי אחד' : `${imported.length} מנויים`;
    const ok = await askConfirm(
      `בגיבוי יש ${inBackup}. הייבוא יחליף ${replaced.join(' ו')}. להמשיך?`,
      'ייבוא',
      false
    );
    if (!ok) return;
  }

  saveSubscriptions(imported);

  if (importedSettings) {
    settings = importedSettings;
    saveSettings(settings);
    applyAppearance(settings);
  }

  selectedCategory = null;
  render();
  if (importDialog.open) importDialog.close();
  showToast(imported.length === 1 ? 'יובא מנוי אחד' : `יובאו ${imported.length} מנויים`);
}

// ===== נתוני דוגמה =====
// כדי לראות איך האפליקציה נראית לפני שמכניסים מנויים אמיתיים.
// כל מנוי דוגמה מסומן ב-example: true, וכך אפשר למחוק את כולם בלחיצה אחת

// תאריך בעוד מספר ימים מהיום, בפורמט YYYY-MM-DD
function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// מנויי הדוגמה:
// שם, מחיר, תדירות, בעוד כמה ימים, קטגוריה, אייקון, כמעט לא בשימוש, הערות
const EXAMPLE_ROWS = [
  ['Netflix', 54.9, 'monthly', 2, 'בידור', 'tv', false, 'חשבון משפחתי'],
  ['Spotify', 21.9, 'monthly', 5, 'בידור', 'music', false, ''],
  ['Disney+', 34.9, 'monthly', 7, 'בידור', 'tv', false, ''],
  ['iCloud', 12.9, 'monthly', 9, 'תוכנה', 'cloud', false, ''],
  ['אפליקציית מדיטציה', 39.9, 'monthly', 12, 'בריאות', 'heart', true, ''],
  ['חדר כושר', 189, 'monthly', 16, 'בריאות', 'activity', false, ''],
  ['חשמל', 380, 'bimonthly', 18, 'בית', 'zap', false, 'סכום ממוצע'],
  ['סלולר', 39, 'monthly', 20, 'תקשורת', 'phone', false, ''],
  ['ביטוח רכב', 2400, 'yearly', 24, 'ביטוח', 'shield', false, 'לבדוק הצעות אחרות לפני החידוש'],
  ['דומיין לאתר', 60, 'yearly', 150, 'תוכנה', 'code', false, ''],
  ['אנטי-וירוס', 99, 'yearly', 340, 'תוכנה', 'shield', false, 'נקנה במבצע Black Friday', 249],
];

// בונה את מנויי הדוגמה. התאריכים מחושבים מהיום, כדי שתמיד יהיו חיובים קרובים
function buildExamples() {
  // העמודה האחרונה (לא חובה) היא מחיר בחידוש
  return EXAMPLE_ROWS.map(([name, price, frequency, inDays, category, icon, rarelyUsed, notes, renewalPrice = 0]) => {
    const nextDate = daysFromToday(inDays);
    return {
      id: crypto.randomUUID(),
      name,
      price,
      frequency,
      nextDate,
      billingDay: parseDate(nextDate).getDate(),
      category,
      icon,
      rarelyUsed,
      notes,
      renewalPrice,
      renewDecision: '',
      example: true,
    };
  });
}

// מוסיף את נתוני הדוגמה (בלי לגעת במנויים אמיתיים)
function loadExamples() {
  const real = loadSubscriptions().filter((sub) => !sub.example);
  saveSubscriptions([...real, ...buildExamples()]);
  selectedCategory = null;
  render();
}

// מוחק רק את מנויי הדוגמה
function clearExamples() {
  const remaining = loadSubscriptions().filter((sub) => !sub.example);
  saveSubscriptions(remaining);

  // מוחקים גם קטגוריות שנוספו רק בשביל הדוגמה (כמו "ביטוח"),
  // אם הן לא מהקטגוריות הרגילות ואף מנוי אמיתי לא משתמש בהן
  const exampleCategories = new Set(EXAMPLE_ROWS.map((row) => row[4]));
  const defaultCategories = new Set(DEFAULT_CATEGORIES.map((category) => category.name));
  const usedCategories = new Set(remaining.map((sub) => sub.category));
  settings.categories = settings.categories.filter(
    (category) =>
      !exampleCategories.has(category.name) ||
      defaultCategories.has(category.name) ||
      usedCategories.has(category.name)
  );
  saveSettings(settings);

  selectedCategory = null;
  render();
  showToast('נתוני הדוגמה נמחקו');
}

// בגרסה קודמת, שמות של שירותים מחו"ל בנתוני הדוגמה נכתבו בעברית.
// מי שכבר טען אז את הדוגמה, מקבל כאן את השמות החדשים באנגלית.
// נוגעים רק במנויי דוגמה (example: true), לא במנויים אמיתיים
const OLD_EXAMPLE_NAMES = {
  'נטפליקס': 'Netflix',
  'ספוטיפיי': 'Spotify',
};

function renameOldExamples() {
  const subscriptions = loadSubscriptions();
  let changed = false;

  for (const sub of subscriptions) {
    if (sub.example && Object.hasOwn(OLD_EXAMPLE_NAMES, sub.name)) {
      sub.name = OLD_EXAMPLE_NAMES[sub.name];
      changed = true;
    }
  }

  if (changed) saveSubscriptions(subscriptions);
}

// האם זו הפעם הראשונה שהדף נפתח בדפדפן הזה (עוד לא נשמר כלום)
function isFirstVisit() {
  try {
    return localStorage.getItem(STORAGE_KEY) === null;
  } catch (error) {
    return false;
  }
}

// ===== המדריך: איך מוצאים את כל המנויים =====

// המפתח שתחתיו נשמרים השלבים שסימנת כ"סיימתי"
const GUIDE_KEY = 'guideProgress';

const guideDialog = document.getElementById('guide-dialog');
const guideSteps = [...guideDialog.querySelectorAll('.guide-step')];
const guideProgressText = document.getElementById('guide-progress-text');
const guideProgressFill = document.getElementById('guide-progress-fill');
const guideResetButton = document.getElementById('guide-reset');

// מחזיר רשימה של שמות השלבים שהושלמו (לפי data-step שב-HTML)
function loadGuideProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUIDE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveGuideProgress(doneSteps) {
  writeStorage(GUIDE_KEY, doneSteps);
}

// מעדכן את המדריך לפי מה שנשמר: וי על שלבים שהושלמו, ופס ההתקדמות
function renderGuideProgress() {
  const doneSteps = loadGuideProgress();
  let doneCount = 0;

  for (const step of guideSteps) {
    const isDone = doneSteps.includes(step.dataset.step);
    step.classList.toggle('done', isDone);
    step.querySelector('.step-done input').checked = isDone;
    if (isDone) doneCount += 1;
  }

  const total = guideSteps.length;
  guideProgressText.textContent =
    doneCount === total ? `סיימת את כל ${total} השלבים. כל הכבוד!` : `סיימת ${doneCount} מתוך ${total} שלבים`;
  guideProgressFill.style.width = `${(doneCount / total) * 100}%`;
  guideResetButton.hidden = doneCount === 0;
}

// פותח את המדריך. אם אף שלב לא פתוח, פותחים את השלב הראשון שעוד לא הושלם
function openGuide() {
  renderGuideProgress();

  if (!guideSteps.some((step) => step.open)) {
    const firstUndone = guideSteps.find((step) => !step.classList.contains('done'));
    if (firstUndone) firstUndone.open = true;
  }

  guideDialog.showModal();
}

// סימון או ביטול של "סיימתי את השלב הזה"
function handleStepDone(step, isDone) {
  const id = step.dataset.step;
  const doneSteps = loadGuideProgress().filter((stepId) => stepId !== id);
  if (isDone) doneSteps.push(id);
  saveGuideProgress(doneSteps);
  renderGuideProgress();

  // אחרי שסיימת שלב: סוגרים אותו ופותחים את השלב הבא שעוד לא הושלם
  if (isDone) {
    step.open = false;
    const index = guideSteps.indexOf(step);
    const next = guideSteps.slice(index + 1).find((s) => !s.classList.contains('done'));
    if (next) {
      next.open = true;
      next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

for (const step of guideSteps) {
  step.querySelector('.step-done input').addEventListener('change', (event) => {
    handleStepDone(step, event.target.checked);
  });
}

// "התחלה מחדש": מנקה את כל הסימונים
guideResetButton.addEventListener('click', () => {
  saveGuideProgress([]);
  guideSteps.forEach((step, index) => {
    step.open = index === 0;
  });
  renderGuideProgress();
});

document.getElementById('guide-button').addEventListener('click', openGuide);
document.getElementById('empty-guide-button').addEventListener('click', openGuide);
document.getElementById('guide-close').addEventListener('click', () => guideDialog.close());

// "הוספת מנוי" מתוך המדריך: הטופס נפתח מעל המדריך.
// אחרי השמירה הטופס נסגר וחוזרים בדיוק לאותו מקום במדריך
document.getElementById('guide-add-button').addEventListener('click', () => openForm());

// ===== חיבור הכפתורים =====

// גיבוי: ייצוא
document.getElementById('export-button').addEventListener('click', openExport);
document.getElementById('copy-backup').addEventListener('click', copyBackup);
document.getElementById('download-backup').addEventListener('click', () => {
  downloadFile(`subscriptions-${todayString()}.json`, exportText.value);
});
document.getElementById('close-export').addEventListener('click', () => exportDialog.close());

// גיבוי: ייבוא
document.getElementById('import-button').addEventListener('click', openImport);
document.getElementById('choose-file').addEventListener('click', () => importInput.click());
document.getElementById('import-from-text').addEventListener('click', () => {
  const text = importText.value.trim();
  if (!text) {
    showToast('קודם מדביקים כאן את טקסט הגיבוי');
    importText.focus();
    return;
  }
  importFromText(text);
});
document.getElementById('close-import').addEventListener('click', () => importDialog.close());

// נקרא אחרי שבחרו קובץ
importInput.addEventListener('change', async () => {
  const file = importInput.files[0];
  if (file) {
    await importFromText(await file.text());
  }
  // מאפסים את השדה, כדי שאפשר יהיה לבחור שוב את אותו קובץ
  importInput.value = '';
});

// נתוני דוגמה
document.getElementById('load-examples').addEventListener('click', loadExamples);
document.getElementById('clear-examples').addEventListener('click', clearExamples);

// טופס המנוי
document.getElementById('add-button').addEventListener('click', () => openForm());
document.getElementById('cancel-button').addEventListener('click', () => dialog.close());
form.addEventListener('submit', handleSubmit);
form.addEventListener('change', (event) => {
  if (event.target.name === 'frequency') updateRenewalField();
});
document.getElementById('renewal-alert-button').addEventListener('click', () => {
  renewalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
form.elements.category.addEventListener('input', updateIconPickerTone);
form.elements.name.addEventListener('input', updateNoIconLetter);

// חלון ההגדרות
document.getElementById('settings-button').addEventListener('click', openSettings);
document.getElementById('settings-cancel').addEventListener('click', () => {
  settingsDialog.close();
  applyAppearance(settings); // חוזרים מיד למראה השמור
});
settingsForm.addEventListener('submit', handleSettingsSubmit);

// תצוגה מקדימה: כל שינוי בצבע או במראה מוצג מיד, עוד לפני השמירה
settingsForm.addEventListener('change', () => applyAppearance(readSettingsForm()));

// כשהחלון נסגר (בשמירה, בביטול או ב-Esc) חוזרים למראה השמור.
// אחרי שמירה זה בדיוק המראה החדש, אז לא משתנה כלום
settingsDialog.addEventListener('close', () => applyAppearance(settings));

document.getElementById('add-category-button').addEventListener('click', addDraftCategory);

// Enter בשדה הקטגוריה החדשה מוסיף אותה (במקום לשמור את כל ההגדרות)
newCategoryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addDraftCategory();
  }
});

// אם המראה הוא "לפי המכשיר" והמכשיר עובר בין בהיר לכהה, מתעדכנים
darkQuery.addEventListener('change', () => applyAppearance(settings));

// וכך גם כשהאתר שמציג את הדף מחליף בין בהיר לכהה
new MutationObserver(() => applyAppearance(settings)).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
});

// ===== הפעלה ראשונה =====
applyAppearance(settings);
buildIconPicker();

// בגרסה שמוצגת כקישור (אבטיפוס), מי שנכנס בפעם הראשונה רואה נתוני דוגמה.
// באפליקציה המקומית SHOW_EXAMPLES_ON_FIRST_VISIT לא מוגדר, אז זה לא קורה
if (window.SHOW_EXAMPLES_ON_FIRST_VISIT && isFirstVisit()) {
  saveSubscriptions(buildExamples());
}

renameOldExamples();
render();
