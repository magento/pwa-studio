/*
 * Uses the jsdoc-to-markdown library to generate function docs
 */
const jsDocs = require('jsdoc-to-markdown');

let createFunctionDocs = ({ sourcePath, githubSource }) => {
    return jsDocs.render({ files: [sourcePath] }).then(content => {
        return new Promise((resolve, reject) => {
            if (!content) {
                reject(Error('Could not generate content', sourcePath));
            } else {
                resolve(
                    `${content}\n\nFor implementation details [**View Source**](${githubSource}).`
                );
            }
        });
    });
};

module.exports = createFunctionDocs;
