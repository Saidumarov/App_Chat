import { createContext, useContext, useState } from "react";
import ruMessages from "../locales/ru.json";
import uzMessages from "../locales/uz.json";
import ozMessages from "../locales/oz.json";
import enMessages from "../locales/en.json";
import { NextIntlClientProvider } from "next-intl";
import { getLocaleFromUrl } from "../hooks/usePhone";

const messages = {
  ru: ruMessages,
  uz: uzMessages,
  oz: ozMessages,
  en: enMessages,
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const url = getLocaleFromUrl();
  const [locale, setLocale] = useState(url || "uz");
  const changeLanguage = (language) => {
    setLocale(language);
    localStorage.setItem("locale", JSON.stringify(language));
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
};

export const useLocale = () => useContext(LanguageContext);
