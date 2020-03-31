const peregrineFiles = require('./peregrine');
const veniaFiles = require('./venia');
const pagebuilderFiles = require('./pagebuilder');

let files = [].concat(peregrineFiles, veniaFiles, pagebuilderFiles);

module.exports = {
    baseGitHubPath:
        'github.com/magento/pwa-studio/blob/develop/',
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
