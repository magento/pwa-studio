function validateEnvironment(env) {
    const envalid = require('envalid');
    const { str, bool, url } = envalid;

    const validation = {
        IMAGE_SERVICE_PATH: str({
            desc:
                'Root path to mount the onboard image optimization service in the DevServer and staging server.',
            example: '/img/',
            default: '/img/'
        }),
        IMAGE_CACHE_EXPIRES: str({
            desc:
                'Lifetime of images in the local cache of resized images. Format is "[length] [unit]", as in "10 minutes" or "1 day".',
            example: '5 minutes',
            default: '1 hour'
        }),
        IMAGE_CACHE_DEBUG: bool({
            desc: 'Log image cache debug info to the console.',
            default: false
        }),
        IMAGE_CACHE_REDIS_CLIENT: str({
            desc:
                'To use a Redis instance instead of a local memory cache for persistence between server processes, set this variable to the socket or URL of the Redis instance.',
            default: ''
        }),
        SERVICE_WORKER_FILE_NAME: str({
            desc:
                'Filename to use when autogenerating a service worker to be served at root.',
            example: 'sw.js',
            default: 'sw.js'
        }),
        MAGENTO_BACKEND_MEDIA_PATH_PRODUCT: str({
            desc:
                'URL path where the PWA expects Magento to serve product media.',
            example: '/media/catalog/product',
            default: '/media/catalog/product'
        }),
        MAGENTO_BACKEND_MEDIA_PATH_CATEGORY: str({
            desc:
                'URL path where the PWA expects Magento to serve category media.',
            example: '/media/catalog/category',
            default: '/media/catalog/category'
        }),
        MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST: bool({
            desc:
                'On first run, create a secure, unique hostname and generate a trusted SSL certificate.',
            default: true
        }),
        MAGENTO_BUILDPACK_SECURE_HOST_AND_UNIQUE_HASH: bool({
            desc:
                'Add a unique hash based on filesystem location to the unique hostname. No effect if MAGENTO_BUILDPACK_PROVIDE_SECURE_HOST is false.',
            default: true
        }),
        ENABLE_SERVICE_WORKER_DEBUGGING: bool({
            desc:
                'Use a service worker in developer mode (PWADevServer), which are disabled in dev mode normally to simplify cache. Good for debugging.',
            default: false
        }),
        UPWARD_JS_UPWARD_PATH: str({
            desc:
                'UPWARD configuration file to use for the PWADevServer and the "stage:venia" sample server.',
            default: 'venia-upward.yml'
        }),
        UPWARD_JS_BIND_LOCAL: bool({
            desc:
                'Upon launching the staging server, automatically attach to a local port and listen.',
            default: true
        }),
        UPWARD_JS_LOG_URL: bool({
            desc:
                'Tell the upward-js prod server to log the bound URL to stdout. Useful in testing and discovery scenarios, but may be disabled in production.',
            default: true
        })
    };
    if (process.env.NODE_ENV !== 'production') {
        validation.MAGENTO_BACKEND_URL = url({
            desc: 'Public base URL of of Magento 2.3 instance.',
            example: 'https://magento2.vagrant65'
        });
        const { readFileSync } = require('fs');
        const path = require('path');
        const chalk = require('chalk');
        const dotenv = require('dotenv');
        let parsedEnv;
        const envPath = path.join(__dirname, '.env');
        try {
            parsedEnv = dotenv.parse(readFileSync(envPath));
            // don't use console.log, which writes to stdout. writing to stdout
            // interferes with webpack json output
            console.warn(
                chalk.green(
                    `Using environment variables from ${chalk.greenBright(
                        '.env'
                    )}`
                )
            );
            if (env.DEBUG || env.NODE_DEBUG) {
                console.warn(
                    '\n  ' +
                        require('util')
                            .inspect(parsedEnv, {
                                colors: true,
                                compact: false
                            })
                            .replace(/\s*[\{\}]\s*/gm, '')
                            .replace(/,\n\s+/gm, '\n  ') +
                        '\n'
                );
            }
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.warn(
                    chalk.redBright(
                        `\nNo .env file in ${__dirname}\n\tYou may need to copy '.env.dist' to '.env' to begin, or create your own '.env' file manually.`
                    )
                );
            } else {
                console.warn(
                    chalk.redBright(
                        `\nCould not retrieve and parse ${envPath}.`,
                        e
                    )
                );
            }
        }
    }

    return envalid.cleanEnv(env, validation);
}

module.exports = validateEnvironment;

if (module === require.main) {
    validateEnvironment(process.env);
}
