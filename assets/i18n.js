// 1️⃣ URL'den dili algıla
function detectLangFromPath() {
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search); // Parametre desteği eklendi

  // 1. Önce URL Yoluna Bak (Production / Rewrite İçin)
  if (path.startsWith('/en') || path.includes('/en/')) return 'en';
  
  // 2. Yoksa URL Parametresine Bak (Localhost İçin)
  if (params.get('lang') === 'en') return 'en';

  // 3. Varsayılan TR
  return 'tr';
}

// 2️⃣ JSON yükle ve DOM'a bas
async function loadLang(lang) {
  try {
    const res = await fetch(`/assets/i18n/${lang}.json`);
    const dict = await res.json();

    // 🔹 Normal text (innerHTML)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const keys = el.dataset.i18n.split('.');
      let value = dict;

      keys.forEach(k => {
        value = value?.[k];
      });

      if (value !== undefined) {
        el.innerHTML = value;
      }
    });

    // 🔹 Placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const keys = el.dataset.i18nPlaceholder.split('.');
      let value = dict;

      keys.forEach(k => {
        value = value?.[k];
      });

      if (value !== undefined) {
        el.setAttribute('placeholder', value);
      }
    });

    // 🔹 Sayfa dili
    document.documentElement.lang = lang;

  } catch (err) {
    console.error('Dil dosyası yüklenemedi:', err);
  }
}

// 3️⃣ Dil değiştir (sadece redirect)
function switchLang(lang) {
  window.location.href = '/' + lang;
}

// 4️⃣ Sayfa yüklenince çalıştır
document.addEventListener('DOMContentLoaded', () => {
  const lang = detectLangFromPath();
  loadLang(lang);
});
