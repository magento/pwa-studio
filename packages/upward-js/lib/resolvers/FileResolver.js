const debug = require('debug')('upward-js:FileResolver');
const AbstractResolver = require('./AbstractResolver');
const { forFileOfType } = require('../compiledResources');

class FileResolver extends AbstractResolver {
    static get resolverType() {
        return 'file';
    }
    static get telltale() {
        return 'file';
    }
    static get paramTypes() {
        return {
            file: {
                type: 'string',
                required: true
            },
            encoding: {
                type: 'oneOf',
                oneOf: ['utf-8', 'utf8', 'latin1', 'binary'],
                default: 'utf-8'
            },
            parse: {
                type: 'oneOf',
                oneOf: ['auto', 'text'],
                default: 'auto'
            }
        };
    }
    static recognize(value) {
        const str = value.toString();
        const derivedConfig = { file: {} };
        if (str.startsWith('file://')) {
            derivedConfig.file.inline = str.slice(7);
        } else if (str.startsWith('./') || str.startsWith('../')) {
            derivedConfig.file.inline = str;
        }
        if (derivedConfig.file.inline) {
            return derivedConfig;
        }
    }
    async resolve(definition) {
        if (!definition.file) {
            throw new Error(
                `File argument is required: ${JSON.stringify(definition)}`
            );
        }
        const toResolve = [
            this.visitor.upward(definition, 'file'),
            definition.encoding
                ? this.visitor.upward(definition, 'encoding')
                : 'utf8',
            definition.parse ? this.visitor.upward(definition, 'parse') : 'auto'
        ];
        const [file, encoding, parse] = await Promise.all(toResolve);
        debug(
            'resolved file %s, encoding %s, parse mode %s',
            file,
            encoding,
            parse
        );
        const { paramTypes } = this.constructor;
        const allowedencodings = paramTypes.encoding.oneOf;
        if (!allowedencodings.some(value => encoding === value)) {
            throw new Error(
                `Invalid 'encoding': ${encoding}. Must be one of ${allowedencodings}`
            );
        }
        debug('encoding %s is valid', encoding);
        const fileText = await this.visitor.io.readFile(file, encoding);
        if (encoding !== 'binary') debug('retrieved file text %s', fileText);
        if (parse === 'text') {
            debug('parse === text, returning file text directly');
            return fileText;
        }
        let Resource;
        if (parse === 'auto') {
            debug('parse === auto, detecting from filename %s\n\n\n\n', file);
            Resource = forFileOfType(file);
            if (!Resource) {
                debug(
                    'autoparse found no parser for %s, returning text instead',
                    file
                );
                return fileText;
            }
        } else {
            const extension = parse.startsWith('.') ? parse : '.' + parse;
            Resource = forFileOfType(extension);
            if (!Resource) {
                throw new Error(`Unsupported parse type '${parse}'`);
            }
        }
        debug('parse === %s, found %s to compile', parse, Resource.name);
        const rsrc = new Resource(fileText, this.visitor.io);
        return rsrc.compile();
    }
}

module.exports = FileResolver;
