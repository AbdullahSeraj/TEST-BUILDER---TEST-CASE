import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import i18n from 'i18next';

interface LanguageContextProps {
    selectLang: string;
    setSelectLang: (lang: string) => void;
}

interface LanguageProviderProps {
    children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [selectLang, setSelectLang] = useState<string>(Cookies.get('i18next') || 'en');

    useEffect(() => {
        if (selectLang) {
            i18n.changeLanguage(selectLang);
            Cookies.set('i18next', selectLang);
            window.document.dir = i18n.dir();
        }
    }, [selectLang]);

    return (
        <LanguageContext.Provider value={{ selectLang, setSelectLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
