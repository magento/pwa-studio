const decimalRE = /^\d*\.?\d+$/;
function castValue(value) {
    const boolStrings = {
        false: false,
        true: true
    };
    const lowered = value.toString().toLowerCase();
    if (boolStrings.hasOwnProperty(lowered)) {
        return boolStrings[lowered];
    }
    if (decimalRE.test(value)) {
        return Number(value);
    }
    return value;
}

const envPrefix = 'UPWARD_JS_';
// Parse and camelcast all environment variables beginning with a prefix.
function envToConfig(env) {
    return Object.entries(env).reduce((cfg, [key, value]) => {
        if (key.startsWith(envPrefix)) {
            const camelCased = key
                .slice(envPrefix.length)
                .toLowerCase()
                .replace(/_[a-z]/g, match => match.charAt(1).toUpperCase());
            cfg[camelCased] = castValue(value);
        }
        return cfg;
    }, {});
}

module.exports = envToConfig;

/**
 *
 * UPWARD_JS_BIND_LOCAL=true \
 * UPWARD_JS_FOO=FALSE \
 * UPWARD_JS_FOO_BAR=9.5 \
 * UPWARD_JS_UPWARD_PATH='./path'
 *
 * becomes
 *
 * {
 *   bindLocal: true,
 *   foo: false,
 *   fooBar: 9.5,
 *   upwardPath: './path'
 * }
 */
