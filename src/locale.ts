import i18n from "i18next";
import {initReactI18next} from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: {
                translation: {
                    "stringLocalIP": "Ваш текущий ip: ",
                    "stringAllIP": "Список всех активных устройств в вашей сети: ",
                    "stringVersionOS": "Текущая ОС: "
                }
            },
            en: {
                translation: {
                    "stringLocalIP": "Your current ip: ",
                    "stringAllIP": "All available devices in your network: ",
                    "stringVersionOS": "Current OS: "
                }
            },
            de: {
                translation: {
                    "stringLocalIP": "Ihre aktuelle IP: ",
                    "stringAllIP": "Alle verfügbaren Geräte in Ihrem Netzwerk: ",
                    "stringVersionOS": "Aktuelles Betriebssystem: "
                }
            },
        },
        lng: "ru",
        fallbackLng: "ru",
        interpolation: {
            escapeValue: false
        }
    });
