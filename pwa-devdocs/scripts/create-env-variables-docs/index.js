const path = require('path');
const fs = require('fs');
const generateEnvVarDefinitionDocs = require('./generateEnvVarDefinitionDocs');

const config = {
    inputFilepath: path.join(
        __dirname,
        '../../../packages/pwa-buildpack/envVarDefinitions.json'
    ),
    outputFilepath: path.join(
        __dirname,
        '../../src/_includes/auto-generated/buildpack/reference/envVarDefinitions.md'
    )
};

const content = generateEnvVarDefinitionDocs(config.inputFilepath);

fs.mkdirSync(path.dirname(config.outputFilepath), { recursive: true });
fs.writeFileSync(config.outputFilepath, content);
