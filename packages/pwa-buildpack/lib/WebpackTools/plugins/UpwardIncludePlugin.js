const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { walkObject } = require('walk-object');
const { promisify } = require('util');
const jsYaml = require('js-yaml');

/**
 * @description webpack plugin that merges UPWARD configurations and
 * autodetects file assets relied on by those configurations
 */
class UpwardIncludePlugin {
    constructor({ bus, upwardDirs }) {
        this.bus = bus;
        this.upwardDirs = upwardDirs;
        this.definition = {};
        debug('created with dirs: %s', upwardDirs);
    }
    apply(compiler) {
        this.compiler = compiler;
        const { inputFileSystem } = compiler;
        this.fs = {
            readFile: promisify(inputFileSystem.readFile.bind(inputFileSystem)),
            stat: promisify(inputFileSystem.stat.bind(inputFileSystem))
        };
        const onRun = () => this.onRun();
        compiler.hooks.beforeRun.tapPromise('UpwardIncludePlugin', onRun);
        compiler.hooks.watchRun.tapPromise('UpwardIncludePlugin', onRun);
    }
    async onRun() {
        const { context } = this.compiler.options;
        this.addAsset('upward.yaml', {
            ref: 'upward.yml',
            mapping: {
                context,
                from: './upward.yml',
                to: './upward.yml',
                transform: async () => {
                    await this.bus
                        .getTargetsOf('@magento/pwa-buildpack')
                        .transformUpward.promise(this.definition);
                    return jsYaml.safeDump(this.definition);
                }
            }
        });
        const directories = [...this.upwardDirs, context];
        this.dirs = new Set(directories);
        const definitions = await this.getDefinitions(directories);
        Object.assign(this.definition, ...definitions);
        await this.generateAssetMap();

        debug('assigned %s definitions', Object.keys(this.definition));

        debug('assets collection complete, %O', this.assetMap);

        new CopyPlugin(
            { patterns: Object.values(this.assetMap) },
            {
                copyUnmodified: true,
                logLevel: 'error'
            }
        ).apply(this.compiler);
    }
    async getDefinitions(directories, definitions = []) {
        const dir = directories.shift();
        const definition = await this.readUpwardFile(dir);
        await this.populateAssetMap(dir, definition);
        definitions.push(definition);

        if (directories.length > 0) {
            return this.getDefinitions(directories, definitions);
        }

        return definitions;
    }
    addAsset(configPath, refMap) {
        this.tempAssetMap = this.tempAssetMap || {};
        this.tempAssetMap[configPath] = refMap;
    }
    async generateAssetMap() {
        this.assetMap = Object.fromEntries(
            Object.values(this.tempAssetMap).map(({ ref, mapping }) => {
                return [ref, mapping];
            })
        );
    }
    extractFileRefs(definition) {
        const refs = {};
        walkObject(definition, ({ value, isLeaf, location }) => {
            if (isLeaf) {
                if (
                    typeof value === 'string' &&
                    value.startsWith('./') &&
                    !value.includes('{{')
                ) {
                    debug('Leaf %s looks like a fs path', value);
                    // Group by full config path so we only use last configs values
                    refs[location.join('.')] = value;
                }
            }
        });
        debug('found %s file refs', Object.values(refs).length);
        return refs;
    }
    async populateAssetMap(dir, definition) {
        await Promise.all(
            Object.entries(this.extractFileRefs(definition)).map(
                async entry => {
                    const [locationKey, ref] = entry;
                    const mapping = await this.getMapping(dir, ref);
                    if (mapping) {
                        this.addAsset(locationKey, {
                            ref,
                            mapping
                        });
                    }
                }
            )
        );
    }
    async getMapping(dir, ref) {
        const { output, context } = this.compiler.options;
        debug(`parsing ${ref} from ${dir}`);
        const fullTargetPath = path.resolve(context, ref);
        debug(
            'does fullTargetPath %s start with %s',
            fullTargetPath,
            output.path
        );
        if (fullTargetPath.startsWith(output.path)) {
            debug('%s is an output target, not including it in assets', ref);
            return false;
        }
        const fullOriginPath = path.resolve(dir, ref);
        if (this.dirs.has(fullOriginPath)) {
            debug('%s is a root upward dir, not including it in assets', ref);
            return false;
        }
        if (await this.isValidResource(fullOriginPath)) {
            debug(
                '%s exists in inputFileSystem. assigning asset %s',
                fullOriginPath,
                dir
            );
            return {
                context: dir,
                from: ref,
                to: ref
            };
        }
        debug('%s stat failed, not adding', fullOriginPath);
        return false;
    }
    async isValidResource(resourcePath) {
        try {
            await this.fs.stat(resourcePath);
            return true;
        } catch (e) {
            return false;
        }
    }
    async readUpwardFile(packageDir) {
        debug('read upward.yml from %s', packageDir);
        const upwardPath = path.join(packageDir, 'upward.yml');
        let yamlTxt;
        let definition;
        try {
            yamlTxt = await this.fs.readFile(upwardPath);
        } catch (e) {
            throw new Error(
                `UpwardIncludePlugin unable to read file ${upwardPath}: ${
                    e.message
                }`
            );
        }
        debug(`read ${upwardPath} file successfully`);
        try {
            definition = await jsYaml.safeLoad(yamlTxt);
        } catch (e) {
            throw new Error(
                `UpwardIncludePlugin error parsing ${upwardPath} contents: \n\n${yamlTxt}`
            );
        }
        debug(`parsed ${upwardPath} file successfully: %o`, definition);
        return definition;
    }
}

module.exports = UpwardIncludePlugin;
