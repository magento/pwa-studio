jest.mock('child_process');
jest.mock('fs');
const { execSync } = require('child_process');
const SecurityCLI = require('../security-cli');
const TempFile = require('../../../temp-file');
const firstSHA = '123456789ABCDEF';
const secondSHA = '68769786BAFBEF';
const fixtures = {
    trustedCertTxt: 'fakeTrustedCertTxt',
    systemKeychains: ` fakeKeychainPath
            shouldIgnore
            `,
    foundCertificates: `
        -----shouldIgnore
SHA-1 hash: ${firstSHA}

        997a6ts97da ignore
SHA-1 hash: 0987654321ABCDE
    `,
    augmentedCertificates: `

SHA-1 hash: ${firstSHA}

        997a6ts97da ignore
SHA-1 hash: 0987654321ABCDE

assdkjkasd
SHA-1 hash: ${secondSHA}
    `
};
function mockCommand(cmd, response) {
    execSync.mockImplementationOnce(sent => {
        expect(sent).toEqual(cmd);
        return response;
    });
    return mockCommand;
}
let cli, certFile;
const mockListKeychains = () =>
    mockCommand('security list-keychains -d system', fixtures.systemKeychains);
const mockFindCerts = (c = fixtures.foundCertificates) =>
    mockCommand(`security find-certificate -apZ fakeKeychainPath`, c);
const mockAddCert = () =>
    mockCommand(
        `sudo -p "\n\n${
            SecurityCLI.ADD_PROMPT
        } " security add-trusted-cert -d -k fakeKeychainPath -r trustRoot -e certExpired -p ssl -p basic ${
            certFile.path
        }`
    );
beforeEach(() => jest.clearAllMocks());
it('has ADD_PROMPT static string property', () => {
    expect(typeof SecurityCLI.ADD_PROMPT).toBe('string');
});
it('does not construct if no system keychains are found', () => {
    expect(() => new SecurityCLI()).toThrow('No system keychains found');
});
it('constructor the system keychain path', () => {
    expect.assertions(2);
    mockCommand('security list-keychains -d system', fixtures.systemKeychains);
    expect(new SecurityCLI()._keychain).toBe('fakeKeychainPath');
});
const prepareTrustedCert = () => {
    mockListKeychains();
    cli = new SecurityCLI();
    certFile = new TempFile(fixtures.trustedCertTxt);
};
it(".addTrustedCert() expects a TempFile and whines if it doesn't get one", () => {
    expect.assertions(3);
    prepareTrustedCert();
    expect(() => cli.addTrustedCert()).toThrow(
        'requires a cert file object with a path property'
    );
    expect(() => cli.addTrustedCert({})).toThrow(
        'requires a cert file object with a path property'
    );
});
it('.addTrustedCert() adds one if none exist', () => {
    expect.assertions(5);
    prepareTrustedCert();
    mockCommand(expect.anything());
    mockAddCert();
    mockFindCerts();
    cli.addTrustedCert(certFile);
    expect(cli._trustedCertsAdded).toMatchObject({
        [fixtures.trustedCertTxt]: firstSHA
    });
});
it('.addTrustedCert() throws if the add appeared not to work', () => {
    expect.assertions(5);
    prepareTrustedCert();
    mockFindCerts();
    mockAddCert();
    mockFindCerts(); // nothing changed...
    expect(() => cli.addTrustedCert(certFile)).toThrow(
        'could not find new SHA'
    );
});
it('.addTrustedCert() detects the new SHA among the others', () => {
    expect.assertions(5);
    prepareTrustedCert();
    mockFindCerts();
    mockAddCert();
    mockFindCerts(fixtures.augmentedCertificates);
    cli.addTrustedCert(certFile);
    expect(cli._trustedCertsAdded).toMatchObject({
        [fixtures.trustedCertTxt]: secondSHA
    });
});
const mockRemoveTrustedCert = (file = certFile) =>
    mockCommand(`sudo -n security remove-trusted-cert -d ${file.path}`);
let sha;
const prepareRemoveCert = () => {
    mockListKeychains();
    cli = new SecurityCLI();
    certFile = new TempFile(fixtures.trustedCertTxt);
    mockFindCerts();
    mockAddCert();
    mockFindCerts(fixtures.augmentedCertificates);
    cli.addTrustedCert(certFile);
    sha = secondSHA;
};
it("expects a TempFile and whines if it doesn't get one", () => {
    expect.assertions(6);
    prepareRemoveCert();
    expect(() => cli.removeTrustedCert()).toThrow(
        'requires a cert file object with a path property'
    );
    expect(() => cli.removeTrustedCert({})).toThrow(
        'requires a cert file object with a path property'
    );
});
it('runs the privileged remove-trusted-cert command and the delete-certificate command', () => {
    prepareRemoveCert();
    mockRemoveTrustedCert();
    mockCommand(
        `sudo -n security delete-certificate -Z ${sha} fakeKeychainPath`
    );
    cli.removeTrustedCert(certFile);
    expect.assertions(6);
});
it('whines if asked to remove an unknown cert', () => {
    prepareRemoveCert();
    certFile = new TempFile('other-contents');
    mockRemoveTrustedCert(certFile);
    expect(() => cli.removeTrustedCert(certFile)).toThrow(
        'Could not find this cert'
    );
    expect.assertions(6);
});
