/**
 * This script agenerates a PWA Studio to Magento Backend
 * compatibility table in markdown.
 */

const fs = require('fs');
const path = require('path');

const compatibilityDefinitions = require('../../magento-compatibility.js');

const outputDirectory = path.resolve('src/_includes/auto-generated');
const outputFilename = 'magento-compatibility.md';
const outputFile = path.resolve(outputDirectory, outputFilename);

/*
 *  Create a table row for every entry in the definition JSON.
 */
const tableRows = Object.keys(compatibilityDefinitions).reduce((rows, pwaVersion) => {
    const magentoVersion = compatibilityDefinitions[pwaVersion];

    const thisRow = `| ${pwaVersion} | ${magentoVersion} |\n`;
    rows += thisRow;
    
    return rows;
}, '');

/*
 *  Create the contents of the markdown file.
 */
const markdownContents = `
| PWA Studio version | Magento core version|
| :---: | :---: |
${ tableRows }
`;

fs.writeFileSync(outputFile, markdownContents);
