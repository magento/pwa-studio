const os = require('os');
const ON_DEATH = require('death')({ uncaughtException: true });
const debug = require('util').debuglog('osxssltrust');
const TempFile = require('../../temp-file');
const OpenSSLCLI = require('../openssl-cli');
const SecurityCLI = require('./security-cli');
const WebpackPEM = require('../webpack-pem');

module.exports = (logger, proc) => () => {
    let webpackPem = new WebpackPEM();
    webpackPem.read();
    let previous = webpackPem.exists && {
        key: webpackPem.key,
        cert: webpackPem.cert
    };
    const cannotCreate = e => {
        logger.warn(
            `Unable to create webpack-dev-server SSL cert. ` +
                `Browsers will not trust your localhost webpack-dev-server.`
        );
        logger.warn(e);
    };
    try {
        webpackPem.write(WebpackPEM.generate());
    } catch (e) {
        cannotCreate(e);
        return;
    }
    if (!webpackPem.exists) {
        cannotCreate(
            new Error(
                'Key and/or cert created by WebpackPEM.generate() were not valid.'
            )
        );
        if (previous) {
            try {
                webpackPem.write(previous);
            } catch (e) {
                cannotCreate(
                    new Error(
                        'Could not reinstate previous webpack server key! Sorry!'
                    )
                );
            }
        }
        return;
    }
    debug(
        `webpack-dev-server SSL cert is valid for node https use, attempting to trust`
    );
    const webpackPemSeparate = {
        keyFile: new TempFile(webpackPem.key, '.key'),
        certFile: new TempFile(webpackPem.cert, '.pem')
    };
    const openssl = new OpenSSLCLI();
    const passin = OpenSSLCLI.createPassphrase();
    const passout = OpenSSLCLI.createPassphrase();
    const p12file = openssl.createP12(
        webpackPemSeparate.keyFile,
        webpackPemSeparate.certFile,
        passin
    );
    const goodPemfile = openssl.createImportablePEM(p12file, passin, passout);

    const security = new SecurityCLI();
    let triedUntrust = false;
    const untrust = () => {
        if (triedUntrust) return;
        triedUntrust = true;
        try {
            security.removeTrustedCert(goodPemfile);
            debug(`Removed trust for cert ${goodPemfile.path}`);
        } catch (e) {
            logger.warn(
                'Could not remove trusted cert! Please remember to revoke trust for your localhost SSL certificate.',
                e
            );
        }
    };
    try {
        security.addTrustedCert(goodPemfile);
        logger.info(
            'Added trusted cert to OSX Keychain. Browsers should now trust your localhost webpack-dev-server.'
        );
        ON_DEATH((signal, err) => {
            untrust();
            if (err && err.message && err.code) {
                throw err;
            }
            // default handler for SIGTERM per https://nodejs.org/api/process.html#process_signal_events
            // is to exit 128 plug SIGTERM's signal number
            if (signal === 'SIGTERM')
                proc.exit(128 + os.constants.signals.SIGTERM);
        });
        proc.on('exit', untrust);
    } catch (e) {
        logger.warn('Could not add trusted cert: ', e);
    }
};
