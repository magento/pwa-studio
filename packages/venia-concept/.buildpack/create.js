const { resolve } = require('path');
function createProjectFromVenia(fse) {
    const gitIgnoredGlob = fse
        .readFileSync(resolve(__dirname, '../.gitignore'), 'utf-8')
        .trim()
        .split('\n')
        .join(',');
    const allIgnoredGlob = `{CHANGELOG*,LICENSE*,.buildpack,${gitIgnoredGlob}}`;
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
        'clean',
        'download-schema',
        'start',
        'start:debug',
        'validate-queries',
        'watch'
    ];
    return {
        visitor: {
            'package.json': ({
                path,
                targetPath,
                options: { name, author, npmClient }
            }) => {
                const pkgTpt = fse.readJsonSync(path);
                const pkg = {
                    name,
                    version: '0.0.1',
                    description:
                        'A new project based on @magento/venia-concept',
                    author,
                    scripts
                };
                toCopyFromPackageJson.forEach(prop => {
                    pkg[prop] = pkgTpt[prop];
                });

                const toPackageScript =
                    npmClient === 'yarn'
                        ? name => pkgTpt.scripts[name]
                        : name =>
                              pkgTpt.scripts[name].replace(
                                  /yarn run/g,
                                  'npm run'
                              );
                scriptsToCopy.forEach(toPackageScript);

                fse.writeJsonSync(targetPath, pkg, {
                    spaces: 2
                });
            },
            'package-lock.json': ({
                path,
                targetPath,
                options: { npmClient }
            }) => {
                if (npmClient === 'npm') {
                    fse.copyFileSync(path, targetPath);
                }
            },
            'yarn.lock': ({ path, targetPath, options: { npmClient } }) => {
                if (npmClient === 'yarn') {
                    fse.copyFileSync(path, targetPath);
                }
            },
            [allIgnoredGlob]: () => {
                return;
            },
            '**/*': ({ stats, path, targetPath }) => {
                if (stats.isDirectory()) {
                    fse.ensureDirSync(targetPath);
                } else {
                    fse.copyFileSync(path, targetPath);
                }
            }
        }
    };
}

module.exports = createProjectFromVenia;
