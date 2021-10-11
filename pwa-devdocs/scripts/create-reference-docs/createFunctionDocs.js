/*
 * Uses the jsdoc-to-markdown library to generate function docs
 */
const jsDocs = require('jsdoc-to-markdown');

let createFunctionDocs = ({ sourcePath, githubSource, childComponents = [] }) => {
    const files = [sourcePath, ...childComponents];
<<<<<<< HEAD
    return jsDocs.render({ files: files }).then(content => {
=======
    const config = {
        files: files,
        partial: [
            path.join(__dirname, 'templates', 'handlebars', 'body.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'link.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'linked-type-list.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'global-index-dl.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'header.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'defaultValue.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'params-table.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'properties-table.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'returns.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'examples.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'scope.hbs'),
            path.join(__dirname, 'templates', 'handlebars', 'heading-indent.hbs'),
        ],
    };
    return jsDocs.render(config).then(content => {
>>>>>>> a374e34f (Used the Link and Logo components as test components for the proposed changes to the API Reference docs templates.)
        return new Promise((resolve, reject) => {
            if (!content) {
                reject(Error(`Could not generate content for ${sourcePath}`, sourcePath));
            } else {
                resolve(
<<<<<<< HEAD
                    `${content}\n\nFor implementation details [**View Source**](${githubSource}).`
=======
                    `${content}\n\n**Source Code**: [pwa-studio/${githubSourceText}](${githubSource})`
>>>>>>> a374e34f (Used the Link and Logo components as test components for the proposed changes to the API Reference docs templates.)
                );
            }
        });
    });
};

module.exports = createFunctionDocs;
