export const isHomeRoute = url => new URL(url).pathname === '/';

export const isHTMLRoute = url =>
    isHomeRoute(url) || new RegExp('.html$').test(new URL(url).pathname);
