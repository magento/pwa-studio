/**
 * Uses the react-docgen library to generate React class docs
 */
const reactDocs = require('react-docgen');
const fs = require('fs');

const templates = require('./templates');

let createClassDocs = (fullTargetPath, overrides) => {
    return new Promise((resolve, reject) => {
        let content = fs.readFileSync(fullTargetPath);
        let componentInfo = reactDocs.parse(content);
        let { description, props } = componentInfo;

        let fileContent =
            description +
            templates.classTable({
                props,
                propsOverrides: overrides
            });

        if (fileContent) {
            resolve(fileContent);
        } else {
            reject(Error('Could not generate docs content', fullTargetPath));
        }
    });
};

module.exports = createClassDocs;
