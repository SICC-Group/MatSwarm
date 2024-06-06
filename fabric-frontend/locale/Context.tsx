import React from 'react';
import { Locale } from './define';

export interface LocaleContextType {
    locale: Locale;
    switchTo: (code: Locale) => void;
}

export const LocaleContext = React.createContext<LocaleContextType>({
    locale: Locale.zh_Hans,
    switchTo: () => { return; },
});
