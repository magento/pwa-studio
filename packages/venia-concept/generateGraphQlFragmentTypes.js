const fetch = require('node-fetch');
const fs = require('fs');

// Right now I've hardcoded this url because we only have env.MAGENTO_BACKEND_URL on run time
fetch('https://staging-5em2ouy-mfwmkrjfqvbjk.us-4.magentosite.cloud/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        variables: {},
        query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
    })
})
    .then(result => result.json())
    .then(result => {
        // here we're filtering out any type information unrelated to unions or interfaces
        const filteredData = result.data.__schema.types.filter(
            type => type.possibleTypes !== null
        );
        result.data.__schema.types = filteredData;
        fs.writeFile(
            './fragmentTypes.json',
            JSON.stringify(result.data),
            err => {
                if (err) {
                    console.error('Error writing fragmentTypes file', err);
                } else {
                    console.log('Fragment types successfully extracted!');
                }
            }
        );
    });
