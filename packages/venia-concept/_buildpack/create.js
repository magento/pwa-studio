const { resolve } = require('path');

function createProjectFromVenia({ fs, tasks, options }) {
    const npmCli = options.npmClient;

    const toCopyFromPackageJson = [
        'main',
        'browser',
        'dependencies',
        'devDependencies',
        'optionalDependencies',
        'engines'
    ];
    const scriptsToCopy = [
        'buildpack',
        'build',
        'build:analyze',
        'build:dev',
        'build:prod',
        'clean',
        'download-schema',
        'lint',
        'prettier',
        'prettier:check',
        'prettier:fix',
        'start',
        'start:debug',
        'test',
        'validate-queries',
        'watch'
    ];
    const scriptsToInsert = {};
    return {
        after({ options }) {
            // The venia-concept directory doesn't have its own babel.config.js
            // since that would interfere with monorepo configuration.
            // Therefore there is nothing to copy, so we use the "after" event
            // to write that file directly.
            fs.outputFileSync(
                resolve(options.directory, 'babel.config.js'),
                "module.exports = { presets: ['@magento/peregrine'] };\n",
                'utf8'
            );
        },
        visitor: {
            // Modify package.json with user details before copying it.
            'package.json': ({
                path,
                targetPath,
                options: { name, author }
            }) => {
                const pkgTpt = fs.readJsonSync(path);
                const pkg = {
                    name,
                    private: true,
                    version: '0.0.1',
                    description:
                        'A new project based on @magento/venia-concept',
                    author,
                    license: 'UNLICENSED',
                    scripts: {}
                };
                toCopyFromPackageJson.forEach(prop => {
                    pkg[prop] = pkgTpt[prop];
                });

                // The venia-concept template is part of the monorepo, which
                // uses yarn for workspaces. But if the user wants to use
                // npm, then the scripts which use `yarn` must change.
                const toPackageScript = script => {
                    const outputScript = script.replace(/\bvenia\b/g, name);
                    return npmCli === 'npm'
                        ? outputScript.replace(/yarn run/g, 'npm run')
                        : outputScript;
                };

                if (!pkgTpt.scripts) {
                    throw new Error(
                        JSON.stringify(pkgTpt, null, 2) +
                            '\ndoes not have a "scripts"'
                    );
                }
                scriptsToCopy.forEach(name => {
                    if (pkgTpt.scripts[name]) {
                        pkg.scripts[name] = toPackageScript(
                            pkgTpt.scripts[name]
                        );
                    }
                });
                Object.keys(scriptsToInsert).forEach(name => {
                    pkg.scripts[name] = toPackageScript(scriptsToInsert[name]);
                });

                if (process.env.DEBUG_PROJECT_CREATION) {
                    setDebugDependencies(fs, pkg);
                }

                fs.outputJsonSync(targetPath, pkg, {
                    spaces: 2
                });
            },
            '.graphqlconfig': ({ path, targetPath, options: { name } }) => {
                const config = fs.readJsonSync(path);
                config.projects[name] = config.projects.venia;
                delete config.projects.venia;
                fs.outputJsonSync(targetPath, config, { spaces: 2 });
            },
            '{CHANGELOG*,LICENSE*,_buildpack/*}': tasks.IGNORE,
            '**/*': tasks.COPY
        }
    };
}

function setDebugDependencies(fs, pkg) {
    console.warn(
        'DEBUG_PROJECT_CREATION: Debugging Venia _buildpack/create.js, so we will assume we are inside the pwa-studio repo and replace those package dependency declarations with local file paths.'
    );
    const overridden = {};
    const workspaceDir = resolve(__dirname, '../../');
    fs.readdirSync(workspaceDir).forEach(packageDir => {
        const packagePath = resolve(workspaceDir, packageDir);
        if (!fs.statSync(packagePath).isDirectory()) {
            return;
        }
        let name;
        try {
            name = fs.readJsonSync(resolve(packagePath, 'package.json')).name;
        } catch (e) {} // eslint-disable-line no-empty
        if (
            // these should not be deps
            !name ||
            name === '@magento/create-pwa' ||
            name === '@magento/venia-concept'
        ) {
            return;
        }
        console.warn(`DEBUG_PROJECT_CREATION: Packing ${name} for local usage`);
        let filename;
        let packOutput;
        try {
            packOutput = require('child_process').execSync(
                'npm pack -s --ignore-scripts --json',
                {
                    cwd: packagePath
                }
            );
            filename = JSON.parse(packOutput)[0].filename;
        } catch (e) {
            throw new Error(
                `DEBUG_PROJECT_CREATION: npm pack in ${name} package failed: output was ${packOutput}\n\nerror was ${
                    e.message
                }`
            );
        }
        const localDep = `file://${resolve(packagePath, filename)}`;
        ['dependencies', 'devDependencies', 'optionalDependencies'].forEach(
            depType => {
                if (pkg[depType] && pkg[depType][name]) {
                    overridden[name] = localDep;
                    pkg[depType][name] = localDep;
                }
            }
        );
    });
    if (Object.keys(overridden).length > 0) {
        console.warn(
            'DEBUG_PROJECT_CREATION: Resolved the following packages via local tarball',
            JSON.stringify(overridden, null, 2)
        );
        pkg.resolutions = Object.assign({}, pkg.resolutions, overridden);
    }
}

module.exports = createProjectFromVenia;
