/**
 * Create reference content from source code.
 * Content is placed inside the _includes folder to be used in actual topic files.
 **/

const process = require('process');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const createClassDocs = require('./createClassDocs');
const createFunctionDocs = require('./createFunctionDocs');

const docsProjectRoot = process.cwd();

config.files.forEach(file => {
    let { target, overrides, type, childComponents: children = [] } = file;

    let sourcePath = path.join(
        path.dirname(docsProjectRoot),
        config.packagesPath,
        target
    );

    const childComponents = children.map(child => {
        return path.join(path.dirname(docsProjectRoot), config.packagesPath, child);
    });

    let githubSource = "https://" + path.join(
        config.baseGitHubPath,
        config.packagesPath,
        target
    );

    let githubSourceText = path.join(
        config.packagesPath,
        target
    );


    let fileDestination = path.join(
        docsProjectRoot,
        config.includesPath,
        path.join(path.dirname(target), path.basename(target, '.js')) + '.md'
    );

    switch (type) {
        case 'class':
            createClassDocs({ sourcePath, overrides, githubSource }).then(
                fileContent => {
                    writeToFile(fileDestination, fileContent);
                }
            );
            break;

        case 'function':
            createFunctionDocs({ sourcePath, githubSource, childComponents, githubSourceText }).then(
                fileContent => {
                    writeToFile(fileDestination, fileContent);
                },
                error => {
                    console.log(error);
                }
            );
            break;

        default:
            break;
    }
});

const writeToFile = (fileDestination, fileContent) => {
    if (fileContent) {
        console.log(
            '> Generating reference docs: ' +
            path.relative(docsProjectRoot, fileDestination)
        );

        fs.mkdirSync(path.dirname(fileDestination), { recursive: true });

        fs.writeFileSync(fileDestination, fileContent);
    } else {
        console.error('> Skipping empty file content for', target);
    }
};
