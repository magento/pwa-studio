const api = require('@graphql-cli/common');
const loaders = require('@graphql-cli/loaders');
const util = require('util');
const core = require('@graphql-inspector/core');
const graphql = require('graphql');

const createInspectorExtension = name => api => {
    loaders.loaders.forEach(loader => {
        api.loaders.schema.register(loader);
    });
    loaders.loaders.forEach(loader => {
        api.loaders.documents.register(loader);
    });
    return {
        name
    };
};

const extensions = [createInspectorExtension('validate')];

const keepClientFields = true;
const strictFragments = false;

async function go() {
    const config = await api.useConfig({
        rootDir: process.cwd(),
        extensions
    });

    const project = config.getProject();
    const schema = await project.getSchema();
    const documents = await project.getDocuments();
    const invalidDocuments = core
        .validate(
            schema,
            documents.map(
                doc =>
                    new graphql.Source(
                        graphql.print(doc.document),
                        doc.location
                    )
            ),
            {
                strictFragments,
                keepClientFields
            }
        )
        .filter(doc => doc.errors.length > 0);
    console.log(util.inspect(invalidDocuments[0]));
}

go().catch(e => {
    console.error(e);
    process.exit(1);
});
