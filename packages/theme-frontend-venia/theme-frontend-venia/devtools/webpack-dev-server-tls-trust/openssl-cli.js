const crypto = require('crypto');
const TempFile = require('../temp-file');
const Runner = require('../external-command-runner');
class OpenSSLCLI {
    static createPassphrase() {
        const phrase = 'P' + crypto.randomBytes(16).toString('hex');
        const file = new TempFile(phrase);
        return 'file:' + file.path;
    }
    constructor() {
        const runner = new Runner('openssl');
        this.run = runner.run.bind(runner);
    }
    createP12(keyFile, pemFile, passout) {
        const p12file = new TempFile(null, '.p12');
        this.run(
            `pkcs12 -export -inkey ${keyFile.path} -in ${pemFile.path} ` +
                `-certfile ${pemFile.path} -out ${
                    p12file.path
                } -passout ${passout}`
        );
        return p12file;
    }
    createImportablePEM(p12file, passin, passout) {
        const pem = new TempFile(null, '.pem');
        this.run(
            `pkcs12 -in ${p12file.path} -out ${
                pem.path
            } -passin ${passin} -passout ${passout}`
        );
        return pem;
    }
}
module.exports = OpenSSLCLI;
