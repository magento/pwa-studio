const path = require('path');
const url = require('url');
const fs = require('fs');
const pkgdir = require('pkg-dir');
const eol = require('eol');
const selfsigned = require('selfsigned');
const debug = require('util').debuglog('webpackpem');

const detectedWebpackDevServerPath = path.join(
    pkgdir.sync(require.resolve('webpack-dev-server')),
    'ssl/server.pem'
);

class WebpackPEM {
    static get DEFAULT_PATH() {
        return detectedWebpackDevServerPath;
    }
    static get KEY_BLOCK_NAME() {
        return 'RSA PRIVATE KEY';
    }
    static get CERT_BLOCK_NAME() {
        return 'CERTIFICATE';
    }
    static BlockParser(keyToLabel) {
        const blocks = Object.keys(keyToLabel).map(key => {
            if (typeof keyToLabel[key] !== 'string') {
                throw Error(
                    'keyToLabel argument must be an object with all-string values'
                );
            }
            const label = keyToLabel[key].toUpperCase();
            const blk = pref => `^\\-+${pref} ${label}\\-+$`;
            const re = new RegExp(
                blk('BEGIN') + '[\\s\\S]+?' + blk('END'),
                'mg'
            );
            return [key, re];
        });
        return contents =>
            blocks.reduce(
                (out, [key, re]) =>
                    Object.assign(out, {
                        [key]: (contents.match(re) || [])[0]
                    }),
                {}
            );
    }
    static generate({
        protocol = 'https',
        hostname = 'localhost',
        port = '8080'
    } = {}) {
        const fqdn = url.format({ protocol, hostname, port });
        const attrs = [
            { name: 'commonName', value: hostname },
            { name: 'emailAddress', value: 'upward@magento.com' }
        ];
        const pems = selfsigned.generate(attrs, {
            algorithm: 'sha256',
            days: 30,
            keySize: 2048,
            extensions: [
                {
                    name: 'basicConstraints',
                    cA: true
                },
                {
                    name: 'keyUsage',
                    keyCertSign: true,
                    digitalSignature: true,
                    nonRepudiation: true,
                    keyEncipherment: true,
                    dataEncipherment: true
                },
                {
                    name: 'extKeyUsage',
                    serverAuth: true,
                    clientAuth: true,
                    codeSigning: true,
                    emailProtection: true,
                    timeStamping: true
                },
                {
                    name: 'nsCertType',
                    client: true,
                    server: true,
                    email: true,
                    objsign: true,
                    sslCA: true,
                    emailCA: true,
                    objCA: true
                },
                {
                    name: 'subjectAltName',
                    altNames: [
                        {
                            // type 2 is DNS
                            type: 2,
                            value: hostname
                        },
                        {
                            type: 2,
                            value: `${hostname}.localdomain`
                        },
                        {
                            type: 2,
                            value: 'lvh.me'
                        },
                        {
                            type: 2,
                            value: '*.lvh.me'
                        },
                        {
                            type: 2,
                            value: '[::1]'
                        },
                        {
                            // type 6 is URI
                            type: 6,
                            value: fqdn
                        },
                        {
                            // type 7 is IP
                            type: 7,
                            ip: '127.0.0.1'
                        },
                        {
                            type: 7,
                            ip: 'fe80::1'
                        }
                    ]
                }
            ]
        });
        return {
            key: pems.private,
            cert: pems.cert
        };
    }
    constructor(
        p = WebpackPEM.DEFAULT_PATH,
        {
            keyBlockName = WebpackPEM.KEY_BLOCK_NAME,
            certBlockName = WebpackPEM.CERT_BLOCK_NAME
        } = {}
    ) {
        this.exists = false;
        this.key = undefined;
        this.cert = undefined;
        this.contents = '';
        this.path = p;
        this._parse = WebpackPEM.BlockParser({
            key: keyBlockName,
            cert: certBlockName
        });
    }
    read() {
        try {
            this.contents = eol.auto(fs.readFileSync(this.path, 'utf8'));
            debug(`found webpack-dev-server SSL cert file at ${this.path}`);
        } catch (e) {
            debug(
                `Could not find a readable webpack-dev-server SSL cert at ${
                    this.path
                }`,
                e
            );
            this.exists = false;
            return;
        }
        const parsed = this._parse(this.contents);
        this.key = parsed.key;
        this.cert = parsed.cert;
        this.exists = !!(this.key && this.cert);
        debug(
            `webpack-dev-server SSL cert at ${this.path} was parseable? ${
                this.exists
            }`
        );
        return this.contents;
    }
    write({ key, cert } = {}) {
        const contents = key + '\n' + cert;
        const parsed = this._parse(contents);
        if (!parsed.key || !parsed.cert) {
            throw Error(
                'Unrecognized input passed to .write() method of WebpackPEM.'
            );
        }
        fs.writeFileSync(this.path, eol.crlf(contents), 'utf8');
        debug(`wrote webpack-dev-server SSL cert to ${this.path}`);
        this.contents = contents;
        this.key = key;
        this.cert = cert;
        this.exists = true;
    }
}
module.exports = WebpackPEM;
