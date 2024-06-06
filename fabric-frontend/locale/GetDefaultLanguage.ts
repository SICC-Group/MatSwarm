import { Locale } from "./define";
import Cookie from 'js-cookie';

export function GetDefaultLanguage(): Locale {
    const djangoLanguage = (Cookie.get('django_language') || '').toLowerCase();
    if (djangoLanguage === 'en' || djangoLanguage === 'en-us') {
        return Locale.en_US;
    }
    return Locale.zh_Hans;
}