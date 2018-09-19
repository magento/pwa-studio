// const debug = require('debug')('upward-js:resolvers');
const ResolverList = [
    require('./InlineResolver'),
    require('./FileResolver'),
    require('./TemplateResolver'),
    require('./ServiceResolver'),
    require('./ProxyResolver'),
    require('./DirectoryResolver'),
    require('./ConditionalResolver')
];

const ResolversByType = ResolverList.reduce((out, Resolver) => {
    out[Resolver.resolverType] = Resolver;
    return out;
}, {});

module.exports = { ResolverList, ResolversByType };
