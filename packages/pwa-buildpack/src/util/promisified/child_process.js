const { promisify } = require('util');
const child_process = require('child_process');
module.exports = {
    exec: promisify(child_process.exec)
};
