const Runner = require('../../external-command-runner');
const debug = require('util').debuglog('securitycli');
class SecurityCLI {
    static get ADD_PROMPT() {
        return 'Enter your password to enable web browsers to trust the development server SSL certificate:';
    }
    constructor() {
        const runner = new Runner('security');
        this.run = runner.run.bind(runner);
        this.sudo = runner.sudo.bind(runner);
        const keychains = this.run('list-keychains -d system');
        if (!keychains) {
            throw Error('No system keychains found!');
        }
        this._keychain = keychains.split('\n')[0].trim();
        this._policyString = 'localhost';
        this._trustedCertsAdded = {};
    }
    _getCertificateSHAs() {
        const certListTxt = this.run(`find-certificate -apZ ${this._keychain}`);
        if (!certListTxt) {
            return [];
        }
        return certListTxt.split('\n').reduce((out, l) => {
            const match = l.match(/^SHA\-1 hash: ([A-F0-9]+)$/);
            return match ? out.concat(match[1]) : out;
        }, []);
    }
    addTrustedCert(certFile, prompt = SecurityCLI.ADD_PROMPT) {
        if (!certFile || !certFile.path) {
            throw Error(
                'addTrustedCert(certFile) requires a cert file object with a path property'
            );
        }
        const shasBefore = this._getCertificateSHAs();
        debug(`before adding trusted cert, found ${shasBefore.length} shas`);
        this.sudo(
            `\n\n${prompt} `,
            `add-trusted-cert -d -k ${this._keychain} -r trustRoot ` +
                `-e certExpired -p ssl -p basic ${certFile.path}`
        );
        const shaAdded = this._getCertificateSHAs().find(
            sha => !shasBefore.some(s => s === sha)
        );
        if (!shaAdded) {
            throw Error('could not find new SHA');
        }
        debug(`Trusted certificate added: ${shaAdded}`);
        this._trustedCertsAdded[certFile.read()] = shaAdded;
    }
    removeTrustedCert(certFile) {
        if (!certFile || !certFile.path) {
            throw Error(
                'removeTrustedCert(certFile) requires a cert file object with a path property'
            );
        }
        // TODO: refactor to remove old certs on launch instead of at exit
        // Temp fix to run sudo non-interactively.
        this.run(`remove-trusted-cert -d ${certFile.path}`, 'sudo -n');
        const sha = this._trustedCertsAdded[certFile.read()];
        if (!sha) {
            throw Error(
                'Could not find this cert in trusted certs cache, cannot delete'
            );
        }
        this.run(`delete-certificate -Z ${sha} ${this._keychain}`, 'sudo -n');
    }
}
module.exports = SecurityCLI;
