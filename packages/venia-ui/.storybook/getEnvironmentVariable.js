const envVarDefinitions = require('@magento/pwa-buildpack/envVarDefinitions.json');

/**
 * Returns the value of the first variable in any section whose name matches the input.
 * @param {string} targetVariable - The name of the environment variable to find.
 */
const getEnvironmentVariable = targetVariable => {
    let match;
    envVarDefinitions.sections.forEach(section => {
        section.variables.forEach(variable => {
            if (variable.name === targetVariable) {
                match = variable;
            }
        });
    });

    if (match) {
        return match.default || match.example;
    }
};

module.exports = {
    getEnvironmentVariable
};
