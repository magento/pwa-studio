const envVarDefinitions = require('@magento/pwa-buildpack/envVarDefinitions.json');

/**
 * Returns the value of the first variable in any section whose name matches the input.
 * @param {string} targetVariable - The name of the environment variable to find.
 */
const getEnvironmentVariable = targetVariable => {
    let match;

    for (section of envVarDefinitions.sections) {
        for (variable of section.variables) {
            if (variable.name === targetVariable) {
                match = variable;
                break;
            }
        }

        if (!!match) {
            break;
        }
    }

    if (match) {
        return match.default || match.example;
    }
};

module.exports = {
    getEnvironmentVariable
};
