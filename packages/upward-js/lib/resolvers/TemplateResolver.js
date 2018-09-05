const debug = require('debug')('upward-js:TemplateResolver');
const { inspect } = require('util');
const { fromPairs } = require('lodash');
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
        if (
            !Array.isArray(definition.provide) ||
            !definition.provide.every(value => typeof value === 'string')
        ) {
            die(`'provide' property must be an array of string context values`);
        }
        debug('validated config %o', definition);
        const toResolve = [
            this.visitor.upward(definition, 'engine'),
            this.visitor.upward(definition, 'template'),
            Promise.all(
                definition.provide.map(async key => {
                    debug('getting %s from context', key);
                    const value = await this.visitor.context.get(key);
                    debug('got %s: %o from context', key, value);
                    return [key, value];
                })
            )
        ];

        const [engine, template, rootEntries] = await Promise.all(toResolve);
        debug('template retrieved, "%s"', template);
        debug('rootEntries retrieved, %o', rootEntries);

        const Engine = Engines[engine];

        if (!Engine) {
            throw new Error(`Template engine '${engine} unsupported`);
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
