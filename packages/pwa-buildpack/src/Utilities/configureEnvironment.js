const debug = require('../util/debug').makeFileLogger(__filename);
const { inspect } = require('util');
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
const envalid = require('envalid');
const camelspace = require('camelspace');
const { pick } = require('lodash');
const prettyLogger = require('../util/pretty-logger');

const buildpackVersion = require('../../package.json').version;
const buildpackReleaseName = `PWA Studio Buildpack v${buildpackVersion}`;

// All environment variables Buildpack and PWA Studio use should be defined in
// envVarDefinitions.json, along with recent changes to those vars for logging.
const { sections, changes } = require('../../envVarDefinitions.json');

/**
 * Turn the JSON entries from envVarDefinitions.json, e.g.
 *
 *     {
 *        "name": "VARNAME",
 *        "type": "str",
 *        "desc": "foo"
 *     }
 *
 * into Envalid configuration calls, e.g.
 *
 *     {
 *        VARNAME: str({
 *           desc: "foo"
 *         })
 *     }
 */
const envalidValidationConfig = {};
for (const section of sections) {
    for (const variable of section.variables) {
        const typeFac = envalid[variable.type];
        if (typeof typeFac !== 'function') {
            throw new Error(
                `Bad environment variable definition. Section ${
                    section.name
                } variable ${JSON.stringify(
                    variable,
                    null,
                    1
                )} declares an unknown type ${variable.type}`
            );
        }
        envalidValidationConfig[variable.name] = envalid[variable.type](
            variable
        );
    }
}

/**
 * Replace the envalid default reporter, which crashes the process, with an
 * error-returning reporter that a consumer can handle.
 *
 */
class EnvironmentInvalidError extends Error {
    constructor(validationErrors) {
        const output = [];
        const missingVarsOutput = [];
        const invalidVarsOutput = [];
        for (const [key, err] of validationErrors) {
            if (err.name === 'EnvMissingError') {
                missingVarsOutput.push(
                    `${key}: ${err.message || '(required)'}`
                );
            } else {
                invalidVarsOutput.push(`${key}: ${err.message}`);
            }
        }

        // Prepend "header" output for each section of the output:
        if (invalidVarsOutput.length) {
            output.push(
                `Invalid environment variables:\n${invalidVarsOutput.join(
                    '\n'
                )}`
            );
        }
        if (missingVarsOutput.length) {
            output.push(
                `Missing required environment variables:\n${missingVarsOutput.join(
                    '\n'
                )}`
            );
        }
        const message = output.join('\n');
        super(message);
        this.originalMessage = message;
        this.validationErrors = validationErrors;
    }
}
function throwReport({ errors = {} }) {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length) {
        throw new EnvironmentInvalidError(errorEntries);
    }
}

function configureEnvironment(dir, log = prettyLogger) {
    /**
     * Ensure .env file is present. If not present and not in production mode,
     * a warning will be logged, but the app will still function if all
     * required environment variables are present via other means.
     */
    parseEnvFile(dir, log);

    const { env, error } = validateEnvironment(process.env, log);
    if (error) {
        return { error };
    }

    // Make a provider that can return nice camelspaced versions of this big
    // list of environment variables.
    return {
        section(sectionPrefix) {
            return camelspace(sectionPrefix).fromEnv(env);
        },
        all() {
            return camelspace.fromEnv(env);
        },
        isProd: env.isProd,
        isProduction: env.isProduction,
        isDev: env.isDev,
        isDevelopment: env.isDevelopment,
        isTest: env.isTest
    };
}

function validateEnvironment(env, log = prettyLogger) {
    /**
     * Check to see if any deprecated, changed, or renamed variables are set,
     * warn the developer, and reassign variables for legacy support.
     */
    const compatEnv = applyBackwardsCompatChanges(env, log);

    /**
     * Validate the environment object with envalid and throw errors for the
     * developer if an env var is missing or invalid.
     */
    try {
        const validEnv = envalid.cleanEnv(compatEnv, envalidValidationConfig, {
            reporter: throwReport,
            dotEnvPath: null // we parse dotEnv manually to do custom error msgs
        });
        if (debug.enabled) {
            // Only do this prettiness if we gotta
            debug(
                'Current known env',
                '\n  ' +
                    inspect(
                        pick(validEnv, Object.keys(envalidValidationConfig)),
                        {
                            colors: true,
                            compact: false
                        }
                    )
                        .replace(/\s*[\{\}]\s*/gm, '')
                        .replace(/,\n\s+/gm, '\n  ') +
                    '\n'
            );
        }
        return { env: validEnv };
    } catch (error) {
        if (!error.validationErrors) {
            throw error;
        }
        log.error(error.originalMessage);
        return { error, env: compatEnv };
    }
}

function parseEnvFile(dir, log) {
    const envPath = path.join(dir, '.env');
    try {
        const { parsed, error } = dotenv.config({ path: envPath });
        if (error) {
            throw error;
        }
        log.info(
            `Using environment variables from ${path.relative(
                process.cwd(),
                envPath
            )}`
        );
        debug('Env vars from .env:', parsed);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            if (e.code === 'ENOENT') {
                log.warn(
                    `No .env file in ${dir}\n\tYou can autogenerate an .env file in your PWA project root by running the command ${chalk.whiteBright(
                        'npx @magento/pwa-buildpack create-env-file'
                    )}.`
                );
            } else {
                log.warn(`\nCould not retrieve and parse ${envPath}.`, e);
            }
        }
    }
}

// display changes alphabetically by env var name
const sortedChanges = changes.slice().sort();
function applyBackwardsCompatChanges(env, log) {
    const mappedLegacyValues = {};
    for (const change of sortedChanges) {
        // the env isn't using the var with changes, no need to log
        const isSet = env.hasOwnProperty(change.name);
        switch (change.type) {
            case 'exampleChanged':
                // Example change only affects you if you have NOT set this var.
                if (env[change.name] === change.original) {
                    log.warn(
                        `Example value for ${
                            change.name
                        } has changed in ${buildpackReleaseName}, due to ${
                            change.reason
                        }.\nOld value: ${change.original}\nNew value: ${
                            change.update
                        }\nThis project is using the old example value; check to make sure this is intentional.`
                    );
                }
                break;
            case 'removed':
                if (isSet) {
                    log.warn(
                        `Environment variable ${
                            change.name
                        } has been removed in ${buildpackReleaseName}, because ${
                            change.reason
                        }.\nCurrent value is ${
                            env[change.name]
                        }, but it will be ignored.`
                    );
                }
                break;
            case 'renamed':
                if (isSet) {
                    let logMsg = `Environment variable ${
                        change.name
                    } has been renamed in ${buildpackReleaseName}. Its new name is ${
                        change.update
                    }.`;
                    if (change.supportLegacy) {
                        if (!env.hasOwnProperty(change.update)) {
                            logMsg +=
                                '\nThe old variable will continue to work for the next several versions, but it will eventually be removed. Please migrate it as soon as possible.';
                            mappedLegacyValues[change.update] =
                                env[change.name];
                        }
                    } else {
                        logMsg +=
                            '\nThe old variable is longer functional. Please migrate to the new ${change.update} variable as soon as possible.';
                    }
                    log.warn(logMsg);
                }
                break;
            default:
                throw new Error(
                    `Found unknown change type "${
                        change.type
                    }" while trying to notify about changed env vars.`
                );
        }
    }
    return {
        ...env,
        ...mappedLegacyValues
    };
}

module.exports = configureEnvironment;
module.exports.validateEnvironment = validateEnvironment;
