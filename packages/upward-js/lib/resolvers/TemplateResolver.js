const debug = require('debug')('upward-js:TemplateResolver');
const { inspect } = require('util');
const { fromPairs, isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');
const MustacheTemplate = require('../compiledResources/MustacheTemplate');
const Engines = {
    mustache: MustacheTemplate
};
module.exports = class TemplateResolver extends AbstractResolver {
    static get resolverType() {
        return 'template';
    }
    static get telltale() {
        return 'engine';
    }
    async resolve(definition) {
        let providePromise;
        const die = msg => {
            throw new Error(
                `Invalid arguments to TemplateResolver: ${inspect(definition, {
                    compact: false
                })}.\n\n${msg}`
            );
        };
        if (!definition.template) {
            die('No template specified.');
        }
        if (!definition.provide) {
            die(
                `'provide' property must be an array of context values or object of resolvable definitions, was ${inspect(
                    definition.provide
                )}`
            );
        } else if (Array.isArray(definition.provide)) {
            if (definition.provide.some(value => typeof value != 'string')) {
                die(
                    `'provide' property must be an array of context values or object of resolvable definitions, was ${inspect(
                        definition.provide
                    )}`
                );
            } else {
                providePromise = Promise.all(
                    definition.provide.map(async name => [
                        name,
                        await this.visitor.context.get(name)
                    ])
                );
            }
        } else if (isPlainObject(definition.provide)) {
            providePromise = Promise.all(
                Object.keys(definition.provide).map(async name => [
                    name,
                    await this.visitor.upward(definition.provide, name)
                ])
            );
        } else {
            die(`Unrecognized 'provide' configuration: ${definition.provide}`);
        }
        debug('validated config %o', definition);
        const toResolve = [
            this.visitor.upward(definition, 'engine'),
            this.visitor.upward(definition, 'template'),
            providePromise
        ];

        let [engine, template, rootEntries] = await Promise.all(toResolve);
        debug('template retrieved, "%s"', template);
        debug('rootEntries retrieved, %o', rootEntries.map(([name]) => name));

        if (!engine) {
            engine = 'mustache';
        }

        const Engine = Engines[engine];

        if (!Engine) {
            throw new Error(`Template engine '${engine}' unsupported`);
        }
        debug('got template engine %s', Engine.name);

        let renderer;
        if (template instanceof Engine) {
            debug(
                'how nice, the template is already resolved into a %s for us',
                Engine.name
            );
            renderer = template;
        } else if (typeof template === 'string') {
            debug('template is a string, creating %s', Engine.name);
            renderer = new Engine(template, this.visitor.io);
        } else {
            throw new Error(
                `Expected string or ${
                    Engine.name
                }-compatible template and received a foreign object ${
                    template.constructor.name
                }!`
            );
        }

        debug('created renderer');

        await renderer.compile();
        debug('renderer compiled');

        const templateContext = fromPairs(rootEntries);

        debug('rendering from context %O', templateContext);

        return renderer.render(templateContext);
    }
};
