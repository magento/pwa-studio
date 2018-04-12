const execa = require('execa');
const { fail } = require('danger');

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
            execa.sync('jest', ['--json']);
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
        }
    }
];

for (const task of tasks) task();
