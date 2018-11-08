import { ClientFunction } from 'testcafe';

/**
 * @description value = storage[key]
 */
const getItem = ClientFunction((key: string) => {
  return new Promise<string>((resolve, reject) => {
    const result = localStorage.getItem(key);
    if (result) {
      resolve(result);
    }
    reject(new Error(`cannot get property from localstorage with ${key} key, result:${result}`));
  });
});

/**
 * @description storage[key] = value
 */
const setItem = ClientFunction((key: string, value: string) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, value);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
});

export const localStorageUtils = {
  getItem,
  setItem,
};
