const peregrineFiles = require('./peregrine');
const veniaConceptFiles = require('./venia-concept');

let files = [].concat(peregrineFiles, veniaConceptFiles);

module.exports = {
    baseGitHubPath:
        'https://github.com/magento-research/pwa-studio/blob/master/',
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
