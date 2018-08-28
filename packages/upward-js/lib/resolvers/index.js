const moize = require('moize').default;
const debug = require('debug')('upward-js:resolvers');
const ParameterValidator = require('../ParameterValidator');
const AbstractResolver = require('./AbstractResolver');
const PublicResolvers = {
    Inline: require('./InlineResolver'),
    File: require('./FileResolver'),
    Template: require('./TemplateResolver'),
    Service: require('./ServiceResolver'),
    Conditional: require('./ConditionalResolver')
};

const PublicResolverEntries = Object.entries(PublicResolvers);

const InternalContextResolver = require('./InternalContextResolver');

const getResolverFor = moize.deep(function getResolverFor(config) {
    if (typeof config === 'string') {
        const Resolver = PublicResolverEntries.find(Candidate =>
            Candidate.acceptsStringConfig(config)
        );
        if (Resolver) {
            debug(
                `Resolver ${
                    Resolver.constructor.name
                } says it can interpret the string config ${config}`
            );
            return Resolver;
        }
        debug(`using InternalContextResolver for ${config}`);
        return InternalContextResolver;
    }
    if (config.resolver) {
        debug(`explicit resolver configuration encountered: %o`, config);
        const Resolver = PublicResolverEntries.find(
            Candidate => Candidate.resolverType === config.resolver
        );
        if (!Resolver) {
            throw new Error(`Unsupported resolver type '${config.resolver}`);
        }
        debug(
            `{ resolver: '${config.resolver}' } => ${Resolver.constructor.name}`
        );
        return Resolver;
    }
    const Resolver = PublicResolverEntries.find(
        ({ telltale }) => telltale && config.hasOwnProperty(telltale)
    );
    if (!Resolver) {
        throw new Error(
            `Could not detect resolver type from configuration %o`,
            config
        );
    }
    debug(`{ ${Resolver.telltale} } => ${Resolver.constructor.name}`);
    return Resolver;
});

const getParamValidatorFor = moize(function getParamValidatorFor(Resolver) {
    return new ParameterValidator(Resolver.paramTypes);
});

const makeResolverFactory = moize(io =>
    moize.deep(params => {
        const Resolver = getResolverFor(params);
        const paramValidator = getParamValidatorFor(Resolver);
        debug(`creating ${Resolver.name} with %o`, params);
        const report = paramValidator.beforeResolved(params);
        if (report.errors.length > 0) {
            throw new Error(
                `Invalid parameters for ${Resolver.name}: \n` +
                    report.errors.map(
                        ({ name, errors }) => `Parameter '${name}'
    - ${errors.join('\n\t- ')}`
                    )
            );
        }
        return new Resolver({
            io,
            params,
            paramValidator,
            resolved: report.resolved
        });
    })
);

const isResolver = moize(thing => thing instanceof AbstractResolver);

module.exports = Object.assign(PublicResolvers, {
    makeResolverFactory,
    isResolver
});
