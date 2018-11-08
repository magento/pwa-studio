import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Environment } from 'types';


function toBoolean(flag: string): boolean {
  if (typeof flag === 'string') {
    return (flag === 'true' ? true :
      flag === 'false' ? false :
        false);
  }
  return false;
}

const path = resolve(__dirname, '../../.env');
const parsedBuffer = readFileSync(path);
const dotenv = parse(parsedBuffer);

export const config = Object.assign({}, dotenv) as Environment;

config.headless = toBoolean(dotenv.headless);
