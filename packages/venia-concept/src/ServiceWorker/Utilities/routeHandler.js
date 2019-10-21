export const isHomeRoute = url => url.pathname === '/';

export const isHTMLRoute = url =>
    isHomeRoute(url) || new RegExp('.html$').test(url.pathname);
