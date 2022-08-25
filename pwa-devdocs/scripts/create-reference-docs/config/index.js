const peregrineFiles = require('./peregrine');
const veniaFiles = require('./venia');
const pagebuilderFiles = require('./pagebuilder');
const buildpackFiles = require('./buildpack');

let files = [].concat(peregrineFiles, veniaFiles, pagebuilderFiles, buildpackFiles);

module.exports = {
    baseGitHubPath:
        'github.com/magento/pwa-studio/blob/develop/',
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
