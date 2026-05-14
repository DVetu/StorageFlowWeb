const LanguageManager = {
  translations: {},
  currentLanguage: 'EN',

  init() {
    if (typeof translations !== 'undefined') {
      this.translations = translations;
    }
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    const supportedLangs = ['EN', 'FR'];
    this.currentLanguage = localStorage.getItem('language') ||
                          (supportedLangs.includes(browserLang) ? browserLang : 'EN');
    this.updateUI();
  },

  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'FR' ? 'EN' : 'FR';
    localStorage.setItem('language', this.currentLanguage);
    this.updateUI();
  },

  updateUI() {
    // 1. Update html lang attribute
    document.documentElement.lang = this.currentLanguage.toLowerCase();

    // 2. UI labels — nav, header, buttons (class="lang" + matching id in LibEn/LibFr)
    const langData = this.translations[this.currentLanguage];
    if (!langData) {
      console.error(`Translations for language '${this.currentLanguage}' not found`);
      return;
    }
    document.querySelectorAll('.lang').forEach(item => {
      if (langData[item.id]) {
        if (item.tagName === 'IMG') item.src = langData[item.id];
        else item.innerHTML = langData[item.id];
      } else console.warn(`Missing translation for key: ${item.id}`);
    });

    // 3. Page content — inject EN as base, then overlay current language on top.
    //    Any key absent from the FR file keeps its EN value until translated.
    if (typeof PageContent !== 'undefined') {
      const inject = (el, val) => {
        if (el.tagName === 'IMG') el.src = val;
        else el.innerHTML = val;
      };
      if (PageContent.EN) {
        Object.entries(PageContent.EN).forEach(([key, val]) => {
          const el = document.getElementById(key);
          if (el) inject(el, val);
        });
      }
      if (this.currentLanguage !== 'EN' && PageContent[this.currentLanguage]) {
        Object.entries(PageContent[this.currentLanguage]).forEach(([key, val]) => {
          const el = document.getElementById(key);
          if (el) inject(el, val);
        });
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
