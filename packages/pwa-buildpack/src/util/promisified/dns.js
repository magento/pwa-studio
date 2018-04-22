const dns = require('dns');
const { promisify } = require('util');
module.exports = {
    lookup: promisify(dns.lookup)
};
