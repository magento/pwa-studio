/*
 * Uses the jsdoc-to-markdown library to generate React hooks docs
 */
const jsDocs = require('jsdoc-to-markdown');
const templates = require('./templates');

let createFunctionDocs = ({ sourcePath, overrides, githubSource }) => {
    return new Promise((resolve, reject) => {
        let apiData = jsDocs.getTemplateDataSync({
            files: [sourcePath]
        });
        let description = apiData[0].description;
        let props = {};
        apiData[0].params.forEach(param => {
            props[param.name] = {
                type: param.type,
                description: param.description
            };
        });
        fileContent =
            description +
            templates.functionTable({
                githubSource,
                props,
                propsOverrides: overrides
            });

        if (fileContent) {
            resolve(fileContent);
        } else {
            reject(Error('Could not generate docs', sourcePath));
        }
    });
};

module.exports = createFunctionDocs;
