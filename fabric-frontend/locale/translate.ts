import { GetDefaultLanguage } from './GetDefaultLanguage';
import { MessagesLoader } from './define';

// 某些动态场景下没有IntlProvider，手动翻译
export function Translate(msgID: string): string {
    const locale = GetDefaultLanguage();
    const msg = MessagesLoader(locale);
    return msg[msgID];
}