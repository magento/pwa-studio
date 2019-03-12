/**
 * This file outputs a summary blurb to the console informing the developer
 * about PWA to Magento version compatibility.
 *
 * This will help developers experiencing compatibility issues to solve them.
 */

const semver = require('semver');

const compatibilityDefinitions = require('../../magento-compatibility.js');
const package = require('../../package.json');

const DOCS_COMPAT_TABLE_PATH = 'https://magento-research.github.io/pwa-studio/';
const currentVersion = package.version;

const pwaVersions = Object.keys(compatibilityDefinitions);
const matchingPWAVersion = pwaVersions.find(pwaVersion =>
    semver.satisfies(currentVersion, pwaVersion)
);

let versionSpecifics = '';
if (matchingPWAVersion) {
    const compatibleMagentoVersion =
        compatibilityDefinitions[matchingPWAVersion];

    versionSpecifics = `
Your version of PWA is: ${currentVersion}.
This version of PWA is compatible with version ${compatibleMagentoVersion} of Magento.
    `;
}

console.log(`
If there are errors above, your versions of PWA and Magento may be incompatible.
${versionSpecifics}
Please refer to the compatibility table in the PWA documentation for more details:
${DOCS_COMPAT_TABLE_PATH}.
`);
