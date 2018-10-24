import { PerformanceObserver } from 'perf_hooks';
import { browser } from 'protractor';

import { register } from 'tsconfig-paths';

// tslint:disable-next-line:no-var-requires
const { setDefaultTimeout } = require('cucumber');

// import { envConfig } from './environment';

// performance observer for timerify decorator
export const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entrie) => {
    const casted: any = entrie;
    console.dir(`${casted[0].__proto__.constructor.name}.${entrie.name} ${entrie.duration} ms`);
  });
});

export const hooks = {
  onPrepare: () => {
    // require('ts-node').register();
    require('tsconfig-paths').register();
    // const baseUrl = '../src';
    // register({
    //   baseUrl,
    //   paths: tsConfig.compilerOptions.paths,
    // });
    obs.observe({ entryTypes: ['function'] });

    browser.waitForAngularEnabled(false); // turn off wait for angular app, since this is non-angular app
    browser.ignoreSynchronization = true;

    setDefaultTimeout(60 * 1000); // cucumber timeout

    // Boolean(envConfig.mobile_emulation) && envConfig.mobile_width && envConfig.mobile_height ?
    //   browser.driver.manage().window().setSize(Number(envConfig.mobile_width), Number(envConfig.mobile_height)) :
    browser.driver.manage().window().setSize(414, 736);
  },
  onComplete: () => {
    obs.disconnect(); // remove from memory observer
    // browser.quit();
  },
};
