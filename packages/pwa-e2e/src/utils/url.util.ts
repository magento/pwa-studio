import { ClientFunction } from 'testcafe';
import { TypedClientFunction } from 'types/testcafe';

const getFillUrl = ClientFunction(() => location.href);

const getUrl: TypedClientFunction<string, []> = ClientFunction(() => location.pathname);

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
  getFillUrl,
  getUrlFromBase,
};
