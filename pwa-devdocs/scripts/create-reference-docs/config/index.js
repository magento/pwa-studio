const peregrineFiles = require('./peregrine');
const veniaConceptFiles = require('./venia-concept');

let files = [].concat(peregrineFiles, veniaConceptFiles);

module.exports = {
    baseGitHubPath:
        'github.com/magento/pwa-studio/blob/develop/',
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
