/**
 * @module Buildpack/Utilities
 */

const debug = require('../util/debug').makeFileLogger(__filename);
const { inspect } = require('util');
const path = require('path');
const dotenv = require('dotenv');
const envalid = require('envalid');
const camelspace = require('camelspace');
const prettyLogger = require('../util/pretty-logger');
const getEnvVarDefinitions = require('./getEnvVarDefinitions');
const validateEnv = require('./runEnvValidators');
const CompatEnvAdapter = require('./CompatEnvAdapter');

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
 *
 * @class Buildpack/Utilities~ProjectConfiguration
 */
class ProjectConfiguration {
    constructor(env, envFilePresent, definitions) {
        /** @private */
        this.definitions = definitions;
        /** Original environment object provided. */
        this.env = Object.assign({}, env);
        /** @property {boolean} envFilePresent A .env file was detected and used */
        this.envFilePresent = envFilePresent;
        this.isProd = env.isProd;
        this.isProduction = env.isProduction;
        this.isDev = env.isDev;
        this.isDevelopment = env.isDevelopment;
        this.isTest = env.isTest;
    }
    /**
     * @param {string} sectionName
     * @returns camelspaced map of all variables starting with `sectionName`
     */
    section(sectionName) {
        return camelspace(sectionName).fromEnv(this.env);
    }
    /**
     *
     * Convenience wrapper for calling {Configuration#section} multiple times
     *   and putting the results in a deeper map.
     * @param {string[]} sectionNames
     * @returns A map of camelspaced section maps, with properties for each argued section name
     */
    sections(...sectionNames) {
        const sectionObj = {};
        for (const sectionName of sectionNames) {
            sectionObj[sectionName] = this.section(sectionName);
        }
        return sectionObj;
    }
    /**
     *
     * @returns All environment properties, camelcased
     */
    all() {
        return camelspace.fromEnv(this.env);
    }
}

/**
 * Load and validate the configuration environment for a project.
 *
 * @param {string} dirOrEnv Project root
 * @param {Object} [customLogger] Pass a console-like object to log elsewhere.
 * @param {Object} [providedDefs] Use provided definitions object instead of
 * retrieving definitions from the BuildBus. _Internal only._
 * @returns {ProjectConfiguration}
 */
async function loadEnvironment(dirOrEnv, customLogger, providedDefs) {
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
    const compat = new CompatEnvAdapter(definitions).apply(incomingEnv);
    compat.warnings.forEach(warning => logger.warn(warning));
    /**
     * Validate the environment object with envalid and throw errors for the
     * developer if an env var is missing or invalid.
     */
    try {
        const loadedEnv = envalid.cleanEnv(
            compat.env,
            envalidValidationConfig,
            {
                dotEnvPath: null, // we parse dotEnv manually to do custom error msgs
                reporter: throwReport,
                strict: true
            }
        );
        if (typeof dirOrEnv === 'string') {
            await validateEnv(dirOrEnv, loadedEnv);
        }
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
        return new ProjectConfiguration(loadedEnv, envFilePresent);
    } catch (error) {
        if (!error.validationErrors) {
            throw error;
        }
        logger.error(error.originalMessage);
        return {
            definitions,
            error,
            env: compat.env,
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

module.exports = loadEnvironment;
