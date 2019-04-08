const peregrineFiles = require('./peregrine');
const veniaConceptFiles = require('./venia-concept');
const veniaLibraryFiles = require('./venia-library');

let files = [].concat(peregrineFiles, veniaConceptFiles, veniaLibraryFiles);

module.exports = {
    packagesPath: 'packages',
    includesPath: 'src/_includes/auto-generated',
    files: files
};
