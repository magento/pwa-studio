const debug = require('debug')('upward-js:MustacheTemplate');
const AbstractCompiledResource = require('./AbstractCompiledResource');
const Hogan = require('hogan.js');
const File = require('../File');

class MustacheTemplate extends AbstractCompiledResource {
    static get supportedExtensions() {
        return ['.mst', '.mustache', '.tpt'];
    }
    constructor(...args) {
        super(...args);
        if (!this.io) {
            throw new Error(
                'MustacheTemplate requires IOAdapter as second argument'
            );
        }
        this._loadedPartials = new Map();
    }
    _tryLoadAllExtensions(
        name,
        extensions = MustacheTemplate.supportedExtensions
    ) {
        return File.create(this.io, name + extensions[0], 'utf8')
            .then(file => file.asBuffer())
            .catch(e => {
                if (e.code !== 'ENOENT' || extensions.length === 1) {
                    throw e;
                }
                return this._tryLoadAllExtensions(name, extensions.slice(1));
            });
    }
    _findUnloadedPartialNames(template) {
        const partialNames = Object.values(template.partials).map(
            ({ name }) => name
        );
        const uniquePartialNames = [...new Set(partialNames)];
        return uniquePartialNames.filter(
            name => !this._loadedPartials.has(name)
        );
    }
    async _loadPartial(name) {
        let partial = this._loadedPartials.get(name);
        if (!partial) {
            try {
                partial = Hogan.compile(
                    (await this._tryLoadAllExtensions(name))
                        .toString('utf8')
                        .trim()
                );
                this._loadedPartials.set(name, partial);
            } catch (error) {
                return { badPartial: { name, error } };
            }
        }
        return partial;
    }
    async _loadPartials(partialNames) {
        const loadedPartials = await Promise.all(
            partialNames.map(name => this._loadPartial(name))
        );

        const badPartials = loadedPartials.filter(
            ({ badPartial }) => badPartial
        );
        if (badPartials.length > 0) {
            const partialErrors = badPartials.map(
                ({ badPartial: { name, error } }) =>
                    `'${name}: ${error.stack}\n`
            );
            throw new Error(`Error in template partials: ${partialErrors}`);
        }

        const foundDescendentPartials = loadedPartials.reduce(
            (found, tpt) => found.concat(this._findUnloadedPartialNames(tpt)),
            []
        );

        if (foundDescendentPartials.length > 0) {
            const uniqueDescendentPartials = [
                ...new Set(foundDescendentPartials)
            ];
            debug(
                'found descendent partials: %j, traversing...',
                uniqueDescendentPartials
            );
            return await this._loadPartials(uniqueDescendentPartials);
        }
    }
    async compile() {
        this._template = Hogan.compile(await this.getSource('utf8'));

        // recursively load all descendent partials ahead of time
        await this._loadPartials(
            this._findUnloadedPartialNames(this._template)
        );

        this._partials = {};
        for (const [name, tpt] of this._loadedPartials.entries()) {
            this._partials[name] = tpt;
        }
        return this;
    }
    async render(context) {
        debug('rendering template %s against context %A', this.source, context);
        return this._template.render(context, this._partials, '').trim();
    }
}

module.exports = MustacheTemplate;
