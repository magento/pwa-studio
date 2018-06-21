const execa = require('execa');
const { fail, markdown, danger } = require('danger');

const fromRoot = path => path.replace(`${process.cwd()}/`, '');
const fence = '```';
const codeFence = str => `${fence}\n${str.trim()}\n${fence}`;

const tasks = [
    function prettierCheck() {
        try {
            execa.sync('npm', ['run', '--silent', 'prettier:check']);
        } catch (err) {
            const { stdout } = err;
            fail(
                'The following file(s) were not ' +
                    'formatted with **prettier**. Make sure to execute `npm run prettier` ' +
                    `locally prior to committing.\n${codeFence(stdout)}`
            );
        }
    },

    function eslintCheck() {
        try {
            execa.sync('npm', ['run', '--silent', 'lint', '--', '-f', 'json']);
        } catch (err) {
            const { stdout } = err;
            const results = JSON.parse(stdout);
            const errFiles = results
                .filter(r => r.errorCount)
                .map(r => fromRoot(r.filePath));
            fail(
                'The following file(s) did not pass **ESLint**. Execute ' +
                    '`npm run lint` locally for more details\n' +
                    codeFence(errFiles.join('\n'))
            );
        }
    },

    function unitTests() {
        try {
            execa.sync('jest', ['--json', '--coverage']);
        } catch (err) {
            const summary = JSON.parse(err.stdout);
            const failedTests = summary.testResults.filter(
                t => t.status !== 'passed'
            );
            // prettier-ignore
            const failSummary = failedTests.map(t =>
    `<details>
    <summary>${fromRoot(t.name)}</summary>
    <pre>${t.message}</pre>
    </details>`
                ).join('\n');
            fail(
                'The following unit tests did _not_ pass 😔. ' +
                    'All tests must pass before this PR can be merged\n\n\n' +
                    failSummary
            );
            return;
        }

        execa.sync('npm', ['run', 'coveralls']);
    }

    // Disabled for now, but leaving in for future implementation.
    // Can't use right now due to the lack of permissions granularity
    // in GitHub
    // async function addProjectLabels() {
    //     const allChangedFiles = [
    //         ...danger.git.created_files,
    //         ...danger.git.deleted_files,
    //         ...danger.git.modified_files
    //     ];
    //     const touchedPackages = allChangedFiles.reduce((touched, path) => {
    //         const matches = path.match(/packages\/([\w-]+)\//);
    //         return matches ? touched.add(matches[1]) : touched;
    //     }, new Set());

    //     if (!touchedPackages.size) return;

    //     await danger.github.api.issues.addLabels(
    //         Object.assign({}, danger.github.thisPR, {
    //             labels: Array.from(touchedPackages).map(s => `pkg:${s}`)
    //         })
    //     );
    // }
];

(async () => {
    for (const task of tasks) await task();
})();
