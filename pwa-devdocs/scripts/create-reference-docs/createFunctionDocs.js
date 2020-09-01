/*
 * Uses the jsdoc-to-markdown library to generate function docs
 */
const jsDocs = require('jsdoc-to-markdown');

let createFunctionDocs = ({ sourcePath, githubSource, childComponents = [] }) => {
    const files = [sourcePath, ...childComponents];
    return jsDocs.render({ files: files }).then(content => {
        return new Promise((resolve, reject) => {
            if (!content) {
                reject(Error(`Could not generate content for ${sourcePath}`, sourcePath));
            } else {
                resolve(
                    `${content}\n\nFor implementation details [**View Source**](${githubSource}).`
                );
            }
        });
    });
};

module.exports = createFunctionDocs;
