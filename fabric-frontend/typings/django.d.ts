declare module 'django' {
  export = django;
}
declare namespace django {
  function gettext(name: string): string;
}
