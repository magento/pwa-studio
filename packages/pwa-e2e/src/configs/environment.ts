import { parse } from 'dotenv';
import { bool, cleanEnv, str } from 'envalid';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Environment } from 'types';

const path = resolve(__dirname, '../../.env');
const parsedBuffer = readFileSync(path);
const dotenv = parse(parsedBuffer);

export const config = cleanEnv(dotenv, {
  headless: bool(),
  baseUrl: str(),
  browser: str({ devDefault: 'chrome' }),
}) as Environment;
