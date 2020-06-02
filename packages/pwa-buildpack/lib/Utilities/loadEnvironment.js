const debug = require('../util/debug').makeFileLogger(__filename);
const { inspect } = require('util');
const path = require('path');
const dotenv = require('dotenv');
const envalid = require('envalid');
const camelspace = require('camelspace');
const prettyLogger = require('../util/pretty-logger');
const getEnvVarDefinitions = require('./getEnvVarDefinitions');

const buildpackVersion = require('../../package.json').version;
const buildpackReleaseName = `PWA Studio Buildpack v${buildpackVersion}`;

/**
 * Replaces the envalid default reporter, which crashes the process, with an
 * error-returning reporter that a consumer can handle.
 */
class EnvironmentInvalidError extends Error {
    constructor(validationErrors) {
        const output = [];
        const missingVarsOutput = [];
        const invalidVarsOutput = [];
        for (const [key, err] of validationErrors) {
            if (err.name === 'EnvMissingError') {
                missingVarsOutput.push(`${key}: ${err.message}`);
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
function throwReport({ errors }) {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length) {
        throw new EnvironmentInvalidError(errorEntries);
    }
}

/**
 * Wrapper around the camelspace API with convenience methods for making custom
 * objects out of subsets of configuration values.
 */
class Configuration {
    constructor(env, envFilePresent, definitions) {
        this.definitions = definitions;
        this.env = Object.assign({}, env);
        this.envFilePresent = envFilePresent;
        this.isProd = env.isProd;
        this.isProduction = env.isProduction;
        this.isDev = env.isDev;
        this.isDevelopment = env.isDevelopment;
        this.isTest = env.isTest;
    }
    section(sectionName) {
        return camelspace(sectionName).fromEnv(this.env);
    }
    sections(...sectionNames) {
        const sectionObj = {};
        for (const sectionName of sectionNames) {
            sectionObj[sectionName] = this.section(sectionName);
        }
        return sectionObj;
    }
    all() {
        return camelspace.fromEnv(this.env);
    }
}

function loadEnvironment(dirOrEnv, customLogger, providedDefs) {
    const logger = customLogger || prettyLogger;
    let incomingEnv = process.env;
    let definitions;
    let envFilePresent;
    if (typeof dirOrEnv === 'string') {
        /**
         * Ensure .env file is present. If not present and not in production
         * mode, a warning will be logged, but the app will still function if
         * all required environment variables are present via other means.
         */
        envFilePresent = parseEnvFile(dirOrEnv, logger);
        definitions = providedDefs || getEnvVarDefinitions(dirOrEnv);
    } else {
        incomingEnv = dirOrEnv;
        if (!providedDefs) {
            const context = process.cwd();
            logger.warn(
                `Calling loadEnvironment(env) with an env object instead of a directory path is deprecated.

If you must, call "loadEnvironment(env, logger, definitions)" where the third argument is a set of definitions already gathered and extended by a build bus. loadEnvironment needs to know the project root path in order to run the BuildBus itself.

This call to loadEnvironment() will assume that the working directory ${context} is project root.`
            );
            definitions = getEnvVarDefinitions(context);
        } else {
            definitions = providedDefs;
        }
    }

    // All environment variables Buildpack and PWA Studio use should be defined in
    // envVarDefinitions.json, along with recent changes to those vars for logging.

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
    const varsByName = {};
    const envalidValidationConfig = {};
    for (const section of definitions.sections) {
        for (const variable of section.variables) {
            varsByName[variable.name] = variable;
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
            envalidValidationConfig[variable.name] = typeFac(variable);
        }
    }

    /**
     * Check to see if any deprecated, changed, or renamed variables are set,
     * warn the developer, and reassign variables for legacy support.
     */
    const compatEnv = applyBackwardsCompatChanges(
        definitions,
        incomingEnv,
        varsByName,
        logger
    );

    /**
     * Validate the environment object with envalid and throw errors for the
     * developer if an env var is missing or invalid.
     */
    try {
        const loadedEnv = envalid.cleanEnv(compatEnv, envalidValidationConfig, {
            dotEnvPath: null, // we parse dotEnv manually to do custom error msgs
            reporter: throwReport,
            strict: true
        });
        if (debug.enabled) {
            // Only do this prettiness if we gotta
            debug(
                'Current known env',
                '\n  ' +
                    inspect(loadedEnv, {
                        colors: true,
                        compact: false
                    })
                        .replace(/\s*[\{\}]\s*/gm, '')
                        .replace(/,\n\s+/gm, '\n  ') +
                    '\n'
            );
        }
        return new Configuration(loadedEnv, envFilePresent);
    } catch (error) {
        if (!error.validationErrors) {
            throw error;
        }
        logger.error(error.originalMessage);
        return {
            definitions,
            error,
            env: compatEnv,
            envFilePresent
        };
    }
}

function parseEnvFile(dir, log) {
    const envPath = path.join(dir, '.env');
    try {
        const { parsed, error } = dotenv.config({ path: envPath });
        if (error) {
            throw error;
        }
        debug(
            `Using environment variables from ${path.relative(
                process.cwd(),
                envPath
            )}: %s`,
            parsed
        );
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            log.warn(`\nCould not retrieve and parse ${envPath}.`, e);
        }
    }
    return true;
}

// display changes alphabetically by env var name
function applyBackwardsCompatChanges(definitions, env, varsByName, log) {
    const sortedChanges = definitions.changes
        .slice()
        .sort((a, b) => a.name > b.name);
    const mappedLegacyValues = {};
    for (const change of sortedChanges) {
        const isSet = env.hasOwnProperty(change.name);
        switch (change.type) {
            case 'defaultChanged':
                // Default change only affects you if you have NOT set this var.
                if (env[change.name] === change.original) {
                    const updatedValue = varsByName[change.name].default;
                    log.warn(
                        `Default value for ${
                            change.name
                        } has changed in ${buildpackReleaseName}, due to ${
                            change.reason
                        }.\nOld value: ${
                            change.original
                        }\nNew value: ${updatedValue}\nThis project is using the old default value for ${
                            change.name
                        }. Check to make sure the change does not cause regressions.`
                    );
                }
                break;
            case 'exampleChanged':
                // Example change only affects you if you have NOT set this var.
                if (env[change.name] === change.original) {
                    const updatedValue = varsByName[change.name].example;
                    log.warn(
                        `Example value for ${
                            change.name
                        } has changed in ${buildpackReleaseName}, due to ${
                            change.reason
                        }.\nOld value: ${
                            change.original
                        }\nNew value: ${updatedValue}\nThis project is using the old example value; check to make sure this is intentional.`
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
                            '\nThe old variable is no longer functional. Please migrate to the new ${change.update} variable as soon as possible.';
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

module.exports = loadEnvironment;
