const path = require('path');
require('dotenv').config({
    path: path.resolve(process.cwd(), 'packages/venia-concept/.env')
});

const excludePatterns =
    process.env.MAGENTO_BACKEND_EDITION === 'EE'
        ? ['!**/*.ce.js']
        : ['!**/*.ee.js'];

const config = {
    schema: [
        `${process.env.MAGENTO_BACKEND_URL}/graphql`,
        '**/client-schema.graphql'
    ],
    documents: [
        './packages/{peregrine,venia-ui,venia-concept}/{lib,src}/**/*.{js,graphql,gql}',
        ...excludePatterns
    ]
};

module.exports = config;
