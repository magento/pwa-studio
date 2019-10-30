const envVarDefinitions = require('@magento/pwa-buildpack/envVarDefinitions.json');

const backendUrlSection = envVarDefinitions.sections.find(section =>
    section.variables.find(variable => variable.name === 'MAGENTO_BACKEND_URL')
);

module.exports = backendUrlSection.variables[0].example;
