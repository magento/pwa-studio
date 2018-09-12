const debug = require('debug')('upward-js:TemplateResolver');
const { inspect } = require('util');
const { fromPairs, isPlainObject } = require('lodash');
const AbstractResolver = require('./AbstractResolver');
const MustacheTemplate = require('../compiledResources/MustacheTemplate');
const Engines = {
    mustache: MustacheTemplate
};
const supportedEngines = new Set(['mustache']);
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
        if (!definition.engine) {
            die('No template engine specified.');
        }
        if (!definition.template) {
            die('No template specified.');
        }
        if (!definition.provide) {
            die(
                `'provide' property must be an array or object of string context values, was ${definition}`
            );
        } else if (Array.isArray(definition.provide)) {
            if (definition.provide.some(value => typeof value != 'string')) {
                die(
                    `'provide' property must be an array or object of string context values, was ${definition}`
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
                Object.entries(definition.provide).map(
                    async ([alias, name]) => [
                        alias,
                        await this.visitor.context.get(name)
                    ]
                )
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

        const [engine, template, rootEntries] = await Promise.all(toResolve);
        debug('template retrieved, "%s"', template);
        debug('rootEntries retrieved, %o', rootEntries.map(([name]) => name));

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

        return renderer.render(fromPairs(rootEntries));
    }
};
