const AbstractCompiler = require('./AbstractCompiler');
const Hogan = require('hogan.js');

class MustacheCompiler extends AbstractCompiler {
    static get supportedExtensions() {
        return ['.mst', '.mustache', '.tpt'];
    }
    constructor(...args) {
        super(...args);
        this.loadedPartials = new Map();
    }
    findUnloadedPartialNames(template) {
        const partialNames = Object.values(template.partials).map(
            ({ name }) => name
        );
        const uniquePartialNames = [...new Set(partialNames)];
        return uniquePartialNames.filter(
            name => !this.loadedPartials.has(name)
        );
    }
    async loadPartial(name) {
        let partial = this.loadedPartials.get(name);
        if (!partial) {
            try {
                partial = Hogan.compile(await this.io.readFile(name, 'utf8'));
                this.loadedPartials.add(name, partial);
            } catch (error) {
                return { badPartial: { name, error } };
            }
            return partial;
        }
    }
    async loadPartials(partialNames) {
        const loadedPartials = Promise.all(
            partialNames.map(name => this.loadPartial(name))
        );

        const badPartials = loadedPartials.filter(
            ({ badPartial }) => badPartial
        );
        if (badPartials.length > 0) {
            const partialErrors = badPartials.map(
                ({ badPartial: { name, error } }) =>
                    `'${this.io.resolvePath(name)}: ${error.stack}\n`
            );
            throw new Error(`Error in template partials: ${partialErrors}`);
        }

        const foundDescendentPartials = loadedPartials.reduce(
            (found, tpt) => found.concat(this.findUnloadedPartialNames(tpt)),
            []
        );

        if (foundDescendentPartials.length > 0) {
            return this.loadPartials(partialNames);
        }
    }
    async compile(contents) {
        const template = Hogan.compile(contents);

        // recursively load all descendent partials ahead of time
        await this.loadPartials(this.findUnloadedPartialNames(this.template));

        const partials = {};
        for (const [name, tpt] in this.loadedPartials) {
            partials[name] = tpt;
        }

        return {
            render: context => template.render(context, partials)
        };
    }
}

module.exports = MustacheCompiler;
