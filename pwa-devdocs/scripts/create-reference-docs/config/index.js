const peregrineFiles = require('./peregrine');
const veniaConceptFiles = require('./venia-concept');

let files = [].concat(peregrineFiles, veniaConceptFiles);

module.exports = {
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
