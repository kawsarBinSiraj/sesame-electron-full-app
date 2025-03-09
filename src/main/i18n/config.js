import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bn from "./dist/bn.json";
import en from "./dist/en.json";

// Initialize i18n
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        bn: { translation: bn },
        // Add more languages as needed
    },
    lng: "en", // Set initial language from electron-store
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
