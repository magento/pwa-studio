const { promisify } = require('util');
const openport = require('openport');
module.exports = {
    find: promisify(openport.find)
};
