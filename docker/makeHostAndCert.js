const devcert = require('devcert');
const domain = process.argv[2];
const fs = require('fs');

const makeFile = (name, content) => {
    fs.writeFile(name, content, err => {
        if (err) throw err;
        console.log(`${name} CREATED SUCCESSFULLY`);
    });
};
const ssl = async function (domain) {
    const s = await devcert.certificateFor(domain);
    makeFile(`./docker/certs/${domain}.crt`, s.cert);
    makeFile(`./docker/certs/${domain}.key`, s.key);
};
ssl(domain);
