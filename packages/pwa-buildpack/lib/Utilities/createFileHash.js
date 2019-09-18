const fs = require('fs');
const crypto = require('crypto');

function createFileHash(filePath) {
    const result = new Promise(resolve => {
        try {
            if (fs.existsSync(filePath)) {
                var fd = fs.createReadStream(filePath);
                var hash = crypto.createHash('md5');
                hash.setEncoding('hex');

                fd.on('end', function() {
                    hash.end();
                    resolve(hash.read());
                });

                fd.on('error', function() {
                    hash.end();
                    console.error(`Unable to read file ${filePath}`);
                    resolve('');
                });

                fd.pipe(hash);
            } else {
                throw new Error(`Error reading file ${filePath}`);
            }
        } catch (err) {
            console.error(`Unable to create hash of ${filePath}`, err);
            resolve('');
        }
    });

    return result;
}

module.exports = createFileHash;
