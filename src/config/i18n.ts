import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        resources: {
            en: { translation: en },
            tr: { translation: tr },
        },
    });

export default i18n;
