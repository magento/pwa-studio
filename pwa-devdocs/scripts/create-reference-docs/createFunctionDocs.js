/*
 * Uses the jsdoc-to-markdown library to generate React hooks docs
 */
const jsDocs = require('jsdoc-to-markdown');
const templates = require('./templates');

let createFunctionDocs = ({ sourcePath, githubSource }) => {
    return jsDocs.getTemplateData({ files: [sourcePath] }).then(apiData => {
        return new Promise((resolve, reject) => {
            // This assumes the first entry is always the main function and
            // the second one is a type definition for a return object if it
            // exists
            let [functionData, returnData] = apiData;

            if (functionData) {
                let { description, params, returns } = functionData;

                fileContent = templates.functionDocs({
                    description,
                    githubSource,
                    parameters: params,
                    returnData
                });
                if (fileContent) {
                    resolve(fileContent);
                } else {
                    reject(Error('Could not generate docs', sourcePath));
                }
            } else {
                reject(Error('Could not get function data', sourcePath));
            }
        });
    });
};

module.exports = createFunctionDocs;
