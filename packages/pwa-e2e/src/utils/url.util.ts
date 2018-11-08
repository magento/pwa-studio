import { ClientFunction } from 'testcafe';

const getUrl = ClientFunction(() => location.href);

const getUrlFromBase = ClientFunction((baseUrl?: string) => {
  if (baseUrl) {
    const origin = location.origin;
    const hostName = location.hostname;
    const host = location.host;
    if (baseUrl === origin || baseUrl === hostName || baseUrl === host) {
      return location.pathname;
    }
  } else {
    return location.pathname;
  }
});

export const UrlUtils = {
  getUrl,
  getUrlFromBase,
};
