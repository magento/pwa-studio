import { config as commonConfig } from './protractor.conf.common';

export let config = Object.assign({}, commonConfig);

config.capabilities = {
  chromeOptions: {
    args: ['--disable-popup-blocking', '--disable-translate', '--headless'],
  },
};
