const fs = require('fs');
const execa = require('execa');

function updateRepoEnvironment() {
    let config;
    try {
        config = execa.sync('git', ['config', '--list', '--local']).stdout;
    } catch (_) {
        // assume we're not in a git repo and there is nothing to be done
        return;
    }
    const driverLine =
        config &&
        config.match(/^merge\.(.+)\.driver\s*=\s*(npx )?npm-merge-driver/m);

    if (driverLine) {
        const npmMergeDriver = driverLine[1];
        console.warn(
            'The current Git repository is still configured to merge  package-lock.json with npm-merge-driver. npm-merge-driver has been removed from PWA Studio. Removing from local Git config...'
        );
        execa.sync('git', [
            'config',
            '--local',
            '--remove-section',
            `merge.${npmMergeDriver}`
        ]);
        console.log('Removed from .git/config');
        const attributes = fs
            .readFileSync('.git/info/attributes', 'utf8')
            .split('\n');
        const lineDriverRE = new RegExp(`^.+merge=${npmMergeDriver}\s*$`);
        const toKeep = attributes.filter(a => !lineDriverRE.test(a));
        if (toKeep.length < attributes.length) {
            fs.writeFileSync('.git/info/attributes', toKeep.join('\n'), 'utf8');
        }
        console.log('Removed from .git/info/attributes');
    }
}

module.exports = updateRepoEnvironment;

// istanbul ignore next: unit tests will not run this directly
if (require.main === module) {
    updateRepoEnvironment();
}
