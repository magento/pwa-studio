/*
 * Uses the jsdoc-to-markdown library to generate function docs
 */
const jsDocs = require('jsdoc-to-markdown');
const path = require('path');

let createFunctionDocs = ({ sourcePath, githubSource, githubSourceText, childComponents = [] }) => {
    const files = [sourcePath, ...childComponents];
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
        return new Promise((resolve, reject) => {
            if (!content) {
                reject(Error(`Could not generate content for ${sourcePath}`, sourcePath));
            } else {
                resolve(
                    `${content}\n\n**Source Code**: [pwa-studio/${githubSourceText}](${githubSource})`
                );
            }
        });
    });
};

module.exports = createFunctionDocs;
