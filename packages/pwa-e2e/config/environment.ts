import { config } from 'dotenv';
import { resolve } from 'path';

import { DotEnvConfig, Environment } from './config.types';

// const parsed = config(
//     { path: resolve(__dirname, '../../', '.env'), encoding: 'utf-8' }
// ).parsed!;

// export const envConfig = Object.assign({}, parsed) as DotEnvConfig;
// console.dir('============ env config =============');
// console.dir(envConfig);
// console.dir('============ end env config =============');
// // reparsing, since dotenv true/false veriables is a string, not boolean
// envConfig.headless =
//     (parsed.headless && parsed.headless === 'true') ? true :
//         (parsed.headless && parsed.headless === 'false') ? false : false;
// envConfig.mobile_emulation =
//     parsed.mobile_emulation === 'true' ? true : parsed.mobile_emulation === 'false' ? false : false;

// envConfig.mobile_height = Number(parsed.mobile_height);
// envConfig.mobile_width = Number(parsed.mobile_width);

// console.dir('================ config info ================');
// console.dir(envConfig);
// console.dir('================ end config info ================');

export const environment: Environment = {
    stage: {
        baseUrl: 'https://localhost:8080',
    },
    local: {
        baseUrl: 'https://localhost:8080',
    },
};
