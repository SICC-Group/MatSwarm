import en_US from './en-US';
import zh_Hans from './zh-Hans'
export enum Locale {
  zh_Hans = 'zh-Hans',
  en_US = 'en-US',
}

// function EnglishMsg() {
//   return import('./en-US').then((value) => {
//     return value.default;
//   });
// }

// function ChineseMsg() {
//   return new Promise((resolve) => {
//     resolve({});
//   });
// }

export function MessagesLoader(locale: Locale): any {
  switch (locale) {
      case Locale.zh_Hans: return zh_Hans;
      case Locale.en_US: return en_US;
  }
}
