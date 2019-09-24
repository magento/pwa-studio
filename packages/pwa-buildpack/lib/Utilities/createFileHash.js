const fs = require('fs');
const crypto = require('crypto');

const getDefaultRandomString = () => crypto.randomBytes(8).toString('hex');

function createFileHash(filePath) {
    const result = new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            const fileStream = fs.createReadStream(filePath);
            const hash = crypto.createHash('md5');
            hash.setEncoding('hex');

            fileStream.on('end', function() {
                hash.end();
                resolve(hash.read());
            });

            fileStream.on('error', function() {
                hash.end();
                reject(`Error creating hash of ${filePath}`);
            });

            fileStream.pipe(hash);
        } else {
            reject(`Error reading file ${filePath}`);
        }
    }).catch(err => {
        console.error(err);
        return getDefaultRandomString()
    });

    return result;
}

module.exports = createFileHash;
