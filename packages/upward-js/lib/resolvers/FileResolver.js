const debug = require('debug')('upward-js:FileResolver');
const AbstractResolver = require('./AbstractResolver');
const { forFileOfType } = require('../compiledResources');
const File = require('../File');

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
                : undefined,
            definition.parse ? this.visitor.upward(definition, 'parse') : 'auto'
        ];
        const [file, encoding, parse] = await Promise.all(toResolve);
        debug(
            'resolved file %s, encoding %s, parse mode %s',
            file,
            encoding,
            parse
        );

        if (encoding) {
            const allowedencodings = FileResolver.paramTypes.encoding.oneOf;
            if (!allowedencodings.some(value => encoding === value)) {
                throw new Error(
                    `Invalid 'encoding': ${encoding}. Must be one of ${allowedencodings}`
                );
            }
            debug('encoding %s is valid', encoding);
        }

        if (parse === 'text') {
            debug('parse === text, will parse file as %s text only', encoding);
            return File.create(this.visitor.io, file, encoding || 'utf8');
        }

        let Resource;
        if (parse === 'auto') {
            debug('parse === auto, detecting from filename %s\n\n\n\n', file);
            Resource = forFileOfType(file);
            if (!Resource) {
                debug(
                    'autoparse found no parser for %s, returning buffer stream instead',
                    file
                );
                return File.create(this.visitor.io, file, encoding);
            }
        } else {
            const extension = parse.startsWith('.') ? parse : '.' + parse;
            Resource = forFileOfType(extension);
            if (!Resource) {
                throw new Error(`Unsupported parse type '${parse}'`);
            }
        }
        const fileObject = await File.create(this.visitor.io, file, encoding);
        debug('created file stream to %s', file);
        debug('parse === %s, found %s to compile', parse, Resource.name);
        const rsrc = new Resource(fileObject, this.visitor.io);
        return rsrc.compile();
    }
}

module.exports = FileResolver;
