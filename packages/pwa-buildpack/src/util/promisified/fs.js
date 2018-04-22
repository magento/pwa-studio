const { promisify } = require('util');
const fs = require('fs');
module.exports = {
    readFile: promisify(fs.readFile),
    realpath: promisify(fs.realpath),
    stat: promisify(fs.stat),
    lstat: promisify(fs.lstat),
    symlink: promisify(fs.symlink),
    unlink: promisify(fs.unlink),
    writeFile: promisify(fs.writeFile)
};
