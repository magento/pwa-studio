const AbstractResolver = require('./AbstractResolver');
const { forFileOfType } = require('../compilers');

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
            charset: {
                type: 'oneOf',
                oneOf: ['utf-8', 'utf8', 'latin1', 'base64'],
                default: 'utf-8'
            },
            parse: {
                type: 'oneOf',
                oneOf: ['auto', 'text', 'graphql', 'mustache', 'json'],
                default: 'auto'
            }
        };
    }
    declareDerivations() {
        return [
            {
                name: 'fileText',
                from: ['file', 'charset'],
                async derive({ file, charset }) {
                    return await this.io.readFile(file, charset);
                }
            },
            {
                name: 'compiler',
                from: ['file', 'parse'],
                async derive({ file, parse }) {
                    const Compiler = forFileOfType(
                        parse === 'auto' ? file : `.${parse}`
                    );
                    return new Compiler(this.io);
                }
            }
        ];
    }
    shouldResolve() {
        return true;
    }
    async resolve({ compiler, fileText }) {
        return compiler.compile(fileText);
    }
}

module.exports = FileResolver;
