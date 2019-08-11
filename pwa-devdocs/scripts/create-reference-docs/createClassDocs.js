/**
 * Uses the react-docgen library to generate React class docs
 */
const reactDocs = require('react-docgen');
const fs = require('fs');

const templates = require('./templates');

let createClassDocs = ({ sourcePath, overrides, githubSource }) => {
    return new Promise((resolve, reject) => {
        let content = fs.readFileSync(sourcePath);
        let componentInfo = reactDocs.parse(content);
        let { description, props } = componentInfo;

        let fileContent = templates.classDocs({
            description,
            githubSource,
            props,
            propsOverrides: overrides
        });

        if (fileContent) {
            resolve(fileContent);
        } else {
            reject(Error('Could not generate docs content', sourcePath));
        }
    });
};

module.exports = createClassDocs;
