import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "HOME": "HOME",
      "ABOUT US": "ABOUT US",
      "SERVICES": "SERVICES",
      "CONTACT": "CONTACT",
      "OFFERS": "OFFERS",
      "Salon Owner": "Salon Owner",
      "Back to Home": "Back to Home",
      "DISCOVER OUR SALONS": "DISCOVER OUR SALONS",
      "View Salon": "View Salon",
      "YOUR FAVORITE": "YOUR FAVORITE",
      "IS NOW ONLINE": "IS NOW ONLINE",
      "Loading salons or no salons available at the moment.": "Loading salons or no salons available at the moment.",
      "Location Not Specified": "Location Not Specified",
      "SHOP YOUR FAVORITE BEAUTY BRANDS AT": "SHOP YOUR FAVORITE BEAUTY BRANDS AT",
      "AVAIL EXCITING OFFERS AND": "AVAIL EXCITING OFFERS AND",
      "MANY OTHER GOODIES.": "MANY OTHER GOODIES.",
      "SHOP NOW": "SHOP NOW",
      "EXPLORE SALONS": "EXPLORE SALONS"
    }
  },
  kn: {
    translation: {
      "HOME": "ಮುಖಪುಟ",
      "ABOUT US": "ನಮ್ಮ ಬಗ್ಗೆ",
      "SERVICES": "ಸೇವೆಗಳು",
      "CONTACT": "ಸಂಪರ್ಕಿಸಿ",
      "OFFERS": "ಕೊಡುಗೆಗಳು",
      "Salon Owner": "ಸಲೂನ್ ಮಾಲೀಕ",
      "Back to Home": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      "DISCOVER OUR SALONS": "ನಮ್ಮ ಸಲೂನ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      "View Salon": "ಸಲೂನ್ ವೀಕ್ಷಿಸಿ",
      "YOUR FAVORITE": "ನಿಮ್ಮ ನೆಚ್ಚಿನ",
      "IS NOW ONLINE": "ಈಗ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದೆ",
      "Loading salons or no salons available at the moment.": "ಸಲೂನ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ ಅಥವಾ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಸಲೂನ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.",
      "Location Not Specified": "ಸ್ಥಳವನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ",
      "SHOP YOUR FAVORITE BEAUTY BRANDS AT": "ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸೌಂದರ್ಯ ಬ್ರಾಂಡ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಶಾಪಿಂಗ್ ಮಾಡಿ",
      "AVAIL EXCITING OFFERS AND": "ಆಕರ್ಷಕ ಕೊಡುಗೆಗಳನ್ನು ಮತ್ತು",
      "MANY OTHER GOODIES.": "ಹಲವು ಇತರ ಉಡುಗೊರೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
      "SHOP NOW": "ಈಗ ಶಾಪಿಂಗ್ ಮಾಡಿ",
      "EXPLORE SALONS": "ಸಲೂನ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ"
    }
  },
  hi: {
    translation: {
      "HOME": "मुख्य पृष्ठ",
      "ABOUT US": "हमारे बारे में",
      "SERVICES": "सेवाएं",
      "CONTACT": "संपर्क करें",
      "OFFERS": "ऑफ़र",
      "Salon Owner": "सैलून मालिक",
      "Back to Home": "होम पर वापस जाएँ",
      "DISCOVER OUR SALONS": "हमारे सैलून खोजें",
      "View Salon": "सैलून देखें",
      "YOUR FAVORITE": "आपका पसंदीदा",
      "IS NOW ONLINE": "अब ऑनलाइन है",
      "Loading salons or no salons available at the moment.": "सैलून लोड हो रहे हैं या अभी कोई सैलून उपलब्ध नहीं है।",
      "Location Not Specified": "स्थान निर्दिष्ट नहीं है",
      "SHOP YOUR FAVORITE BEAUTY BRANDS AT": "अपने पसंदीदा सौंदर्य ब्रांड्स की खरीदारी यहाँ करें",
      "AVAIL EXCITING OFFERS AND": "रोमांचक ऑफ़र और",
      "MANY OTHER GOODIES.": "कई अन्य उपहार प्राप्त करें।",
      "SHOP NOW": "अभी खरीदारी करें",
      "EXPLORE SALONS": "सैलून खोजें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
