import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import srTranslation from "../locales/sr.json";
import deTranslation from "../locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    sr: { translation: srTranslation },
    de: { translation: deTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
