/**
 * Uses react-docgen to create reference content from source code.
 * Content is placed inside the _includes folder to be used in actual topic files.
 **/

const reactDocs = require('react-docgen');
const process = require('process');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const templates = require('./templates');

const docsProjectRoot = process.cwd();

config.files.forEach(file => {
    let { target, overrides } = file;

    let content = fs.readFileSync(
        path.join(path.dirname(docsProjectRoot), config.packagesPath, target)
    );

    let componentInfo = reactDocs.parse(content);

    let { description, props } = componentInfo;

    let fileContent =
        description +
        templates.referenceTable({ props, propsOverrides: overrides });

    let fileDestination = path.join(
        docsProjectRoot,
        config.includesPath,
        path.join(path.dirname(target), path.basename(target, '.js')) + '.md'
    );

    console.log(
        '> Generating reference docs: ' +
            path.relative(docsProjectRoot, fileDestination)
    );

    fs.mkdirSync(path.dirname(fileDestination), { recursive: true });

    fs.writeFileSync(fileDestination, fileContent);
});
