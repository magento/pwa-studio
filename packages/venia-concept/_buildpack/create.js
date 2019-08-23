const { resolve } = require('path');

const isDebugging = () => !!process.env.DEBUG_PROJECT_CREATION;

function createProjectFromVenia({ fs }) {
    const toCopyFromPackageJson = [
        'main',
        'browser',
        'dependencies',
        'devDependencies',
        'optionalDependencies',
        'engines'
    ];
    const scriptsToCopy = [
        'build',
        'build:analyze',
        'build:prod',
        'buildpack',
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
    return {
        after({ options }) {
            fs.outputFileSync(
                resolve(options.directory, 'babel.config.js'),
                "module.exports = { presets: ['@magento/peregrine'] };\n",
                'utf8'
            );
        },
        visitor: {
            'package.json': ({
                path,
                targetPath,
                options: { name, author, npmClient }
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

                const npmCli = isDebugging() ? 'yarn' : npmClient;

                const toPackageScript =
                    npmCli === 'yarn'
                        ? script => script
                        : script =>
                              script && script.replace(/yarn run/g, 'npm run');
                scriptsToCopy.forEach(name => {
                    pkg.scripts[name] = toPackageScript(pkg.scripts[name]);
                });

                pkg.scripts.build = toPackageScript(
                    'yarn run clean && yarn run validate-queries && yarn run build:prod'
                );
                if (isDebugging()) {
                    console.warn(
                        'Debugging Venia _buildpack/create.js, so we will assume we are inside the pwa-studio repo and replace those package dependency declarations with local file paths.'
                    );
                    const workspaceDir = resolve(__dirname, '../../');
                    fs.readdirSync(workspaceDir).forEach(packageDir => {
                        const packagePath = resolve(workspaceDir, packageDir);
                        if (!fs.statSync(packagePath).isDirectory()) {
                            return;
                        }
                        let name;
                        try {
                            name = fs.readJsonSync(
                                resolve(packagePath, 'package.json')
                            ).name;
                        } catch (e) {}
                        if (!name) {
                            return;
                        }
                        const [{ filename }] = JSON.parse(
                            require('child_process').execSync(
                                'npm pack --json',
                                { cwd: packagePath }
                            )
                        );
                        [
                            'dependencies',
                            'devDependencies',
                            'optionalDependencies'
                        ].forEach(depType => {
                            if (pkg[depType] && pkg[depType][name]) {
                                const localDep = `file://${resolve(
                                    packagePath,
                                    filename
                                )}`;
                                pkg[depType][name] = localDep;
                                if (!pkg.resolutions) {
                                    pkg.resolutions = {};
                                }
                                pkg.resolutions[name] = localDep;
                            }
                        });
                    });
                }

                fs.outputJsonSync(targetPath, pkg, {
                    spaces: 2
                });
            },
            'package-lock.json': ({
                path,
                targetPath,
                options: { npmClient }
            }) => {
                const npmCli = isDebugging() ? 'yarn' : npmClient;
                if (npmCli === 'npm') {
                    fs.copyFileSync(path, targetPath);
                }
            },
            'yarn.lock': ({ path, targetPath, options: { npmClient } }) => {
                const npmCli = isDebugging() ? 'yarn' : npmClient;
                if (npmCli === 'yarn') {
                    fs.copyFileSync(path, targetPath);
                }
            },
            // additional ignores
            '{CHANGELOG*,LICENSE*,_buildpack/*}': () => null,
            '**/*': ({ stats, path, targetPath }) => {
                if (stats.isDirectory()) {
                    fs.ensureDirSync(targetPath);
                } else {
                    fs.copyFileSync(path, targetPath);
                }
            },
        }
    };
}

module.exports = createProjectFromVenia;
