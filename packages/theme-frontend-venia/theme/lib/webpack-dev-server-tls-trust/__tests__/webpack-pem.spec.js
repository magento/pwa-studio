jest.mock('fs');
const fs = require('fs');
const eol = require('eol');
const WebpackPEM = require('../webpack-pem');
const { URL } = require('url');
const forge = require('node-forge');
const PHOO = `
------BEGIN TEST PHOO------
haluhglauhguhalgh
------END TEST PHOO------
`.trim();
const BAHR = `
---BEGIN TEST BAHR---
nhgnfhgbhmgb
---END TEST BAHR---
`.trim();
const PHOO_BAHR = `
${PHOO}
${BAHR}
`.trim();
let goodPem, key, cert;
beforeAll(() => {
    goodPem = WebpackPEM.generate();
    key = eol.auto(goodPem.key).trim();
    cert = eol.auto(goodPem.cert).trim();
});
beforeEach(() => {
    jest.clearAllMocks();
    fs.__reset();
});
test('static .BlockParser() takes a key-to-label object and throws if the object has non-string values', () => {
    expect(() => WebpackPEM.BlockParser({ k: 2 })).toThrow(
        'keyToLabel argument must be an object with all-string values'
    );
});
const testParser = () =>
    WebpackPEM.BlockParser({
        foo: 'test phoo',
        bar: 'test bahr'
    });
test('BlockParser parses a string into labeled substrings based on delimited blocks', () => {
    const parse = testParser();
    const { foo, bar } = parse(PHOO_BAHR);
    expect(foo).toBe(PHOO);
    expect(bar).toBe(BAHR);
});
test('BlockParser silently fails when the text does not match', () => {
    const parse = testParser();
    let parsed;
    expect(() => {
        parsed = parse('blorf');
    }).not.toThrow();
    expect(parsed).toBeInstanceOf(Object);
    expect(parsed.foo).toBeFalsy();
    expect(parsed.bar).toBeFalsy();
});
test('static .generate() creates a webpack-valid key-cert pair', () => {
    expect(() => forge.pki.certificateFromPem(goodPem.cert)).not.toThrow();
    expect(() => forge.pki.privateKeyFromPem(goodPem.key)).not.toThrow();
    expect(() => new WebpackPEM().write(goodPem)).not.toThrow();
});
test('static .generate() takes an optional argument for a different URL', () => {
    const pem = WebpackPEM.generate(new URL('https://fake.domain:8081'));
    const cert = forge.pki.certificateFromPem(pem.cert);
    expect(cert.subject.attributes).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                name: 'commonName',
                value: 'fake.domain'
            })
        ])
    );
    expect(() => new WebpackPEM().write(pem)).not.toThrow();
});
test('.read() reads from the default path', () => {
    fs.__mockWriteFileSync(WebpackPEM.DEFAULT_PATH, '');
    new WebpackPEM().read();
    expect(fs.readFileSync).toHaveBeenCalledWith(
        WebpackPEM.DEFAULT_PATH,
        'utf8'
    );
});
test('.read() reads from a custom path', () => {
    fs.__mockWriteFileSync('customPath', '');
    new WebpackPEM('customPath').read();
    expect(fs.readFileSync).toHaveBeenCalledWith('customPath', 'utf8');
});
test('.read() fails silently if the path does not exist', () => {
    const pem = new WebpackPEM();
    pem.read();
    expect(pem.exists).toBe(false);
});
test('.read() fails silently if the key and cert are not both valid', () => {
    const pem = new WebpackPEM();
    fs.__mockWriteFileSync(WebpackPEM.DEFAULT_PATH, key);
    pem.read();
    expect(pem).toMatchObject({
        key,
        contents: key,
        exists: false
    });
    fs.__mockWriteFileSync(WebpackPEM.DEFAULT_PATH, cert);
    pem.read();
    expect(pem).toMatchObject({
        cert,
        contents: cert,
        exists: false
    });
});
test('.read() sets .exists, .key, and .cert if key and cert are valid', () => {
    fs.__mockWriteFileSync(WebpackPEM.DEFAULT_PATH, key + '\n' + cert);
    const pem = new WebpackPEM();
    pem.read();
    expect(pem).toMatchObject({
        key,
        cert,
        exists: true
    });
});
let pem;
const writeGoodPem = () => {
    pem = new WebpackPEM();
    pem.write({ key, cert });
};
test('.write() throws if test receives a bad key or cert', () => {
    pem = new WebpackPEM();
    expect(() => pem.write()).toThrow('Unrecognized input');
    expect(() => pem.write({ key })).toThrow('Unrecognized input');
    expect(() => pem.write({ cert })).toThrow('Unrecognized input');
});
test('.write() writes a valid key and cert to fs', () => {
    writeGoodPem();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
        pem.path,
        eol.crlf(key + '\n' + cert),
        'utf8'
    );
});
test('.write() sets contents, key, and cert properties', () => {
    writeGoodPem();
    expect(pem).toMatchObject({
        contents: key + '\n' + cert,
        key,
        cert,
        exists: true
    });
});
