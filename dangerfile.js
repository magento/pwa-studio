const { fail, warn, markdown, danger } = require('danger');

const fromRoot = p => require('path').relative('', p);

const packageNames = {
    'venia-concept': 'Venia',
    'pwa-buildpack': 'Buildpack',
    peregrine: 'Peregrine'
};
const pathToPackageName = filepath => {
    const path = require('path');
    const packageDir = path
        .normalize(path.relative('packages', filepath))
        .split(path.sep)[0];
    return packageNames[packageDir] || packageDir;
};

const reportDir = './test-results/';
const reportFile = name => {
    const path = require('path');
    const mkdirp = require('mkdirp');
    const subdir = path.join(reportDir, name);
    mkdirp.sync(subdir);
    return path.join(subdir, 'results.xml');
};

const fence = '```';
const codeFence = str => `${fence}\n${str.trim()}\n${fence}`;

function timer() {
    const msPerSec = 1e3;
    const nsPerMillisec = 1e6;
    const formatTime = ([seconds, nanoseconds]) =>
        Math.round(seconds * msPerSec + nanoseconds / nsPerMillisec) / msPerSec;
    const startTime = process.hrtime();
    let lastLap = startTime;
    return {
        lap() {
            const lapTime = process.hrtime(lastLap);
            lastLap = process.hrtime();
            return formatTime(lapTime);
        },
        stop() {
            return formatTime(process.hrtime(startTime));
        }
    };
}

function jUnitSuite(title) {
    const fs = require('fs');
    const xml = require('xml');
    const stopwatch = timer();
    let failureCount = 0;
    let errorCount = 0;
    const cases = [];
    function testCase(name, type, message, trace) {
        const tcAttrs = {
            _attr: { classname: '', name, time: stopwatch.lap() }
        };
        return {
            testcase: type
                ? [
                      tcAttrs,
                      {
                          [type]: trace
                              ? { _attr: { message }, _cdata: trace }
                              : {
                                    _attr: { message }
                                }
                      }
                  ]
                : [tcAttrs]
        };
    }
    return {
        pass(name) {
            cases.push(testCase(name));
        },
        fail(name, message, trace) {
            cases.push(testCase(name, 'failure', message, trace));
            failureCount++;
        },
        error(name, message, trace) {
            cases.push(testCase(name, 'error', message, trace));
            errorCount++;
        },
        save(filename) {
            const time = stopwatch.stop();
            fs.writeFileSync(
                filename,
                xml({
                    testsuites: [
                        {
                            _attr: {
                                tests: cases.length,
                                failures: failureCount,
                                time
                            }
                        },
                        {
                            testsuite: [
                                {
                                    _attr: {
                                        name: title,
                                        errors: errorCount,
                                        failures: failureCount,
                                        skipped: 0,
                                        timestamp: new Date().toISOString(),
                                        time,
                                        tests: cases.length
                                    }
                                },
                                ...cases
                            ]
                        }
                    ]
                }),
                'utf8'
            );
        }
    };
}

const tasks = [
    function prettierCheck() {
        const junit = jUnitSuite('Prettier');
        let stdout, stderr;
        try {
            const execa = require('execa');
            const result = execa.sync('yarn', [
                'run',
                '--silent',
                'prettier:check',
                '--loglevel=debug'
            ]);
            stdout = result.stdout;
            stderr = result.stderr;
        } catch (err) {
            if (typeof stdout !== 'string') {
                // execa didn't require
                throw err;
            }
            stdout = err.stdout;
            stderr = err.stderr;
        }
        const failedFiles = stdout.split('\n').filter(s => s.trim());
        // Prettier doesn't normally print the files it covered, but in debug
        // mode, you can extract them with these regex (as of Prettier 1.13.5)
        // This is a hack based on debug output not guaranteed to stay the same.
        const errorLineStartRE = /^\[error\]\s*/;
        const errors = stderr.match(/(\[error\].+?\n)+/gim);
        const errorMap = {};
        if (errors) {
            errors.forEach(block => {
                const lines = block.split('\n[error] ');
                const firstLine = lines.shift();
                if (errorLineStartRE.test(firstLine)) {
                    // parseable
                    const [name, message] = firstLine
                        .replace(errorLineStartRE, '')
                        .split(':')
                        .map(s => s.trim());
                    if (name && message) {
                        errorMap[name] = {
                            message,
                            trace: lines.join('\n')
                        };
                    }
                }
            });
        }
        const coveredFiles = stderr.match(
            /\[debug\]\s*resolve config from '[^']+'\n/gim
        );
        if (!coveredFiles || coveredFiles.length === 0) {
            let warning = 'Prettier did not appear to cover any files.';
            const prettierVersion = require('prettier/package.json').version;
            if (prettierVersion !== '1.13.5') {
                warning +=
                    '\nThis may be due to an unexpected change in debug output in a version of Prettier later than 1.13.5.';
            }
            warn(warning);
        }
        coveredFiles.forEach(line => {
            const filename = line.match(/'([^']+)'/)[1];
            if (errorMap[filename]) {
                junit.error(
                    filename,
                    errorMap[filename].message,
                    errorMap[filename].trace
                );
            } else if (failedFiles.includes(filename)) {
                junit.fail(filename, 'was not formatted with Prettier');
            } else {
                junit.pass(filename);
            }
        });
        junit.save(reportFile('prettier'));
        if (failedFiles.length > 0) {
            fail(
                'The following file(s) were not ' +
                    'formatted with **prettier**. Make sure to execute `yarn run prettier` ' +
                    `locally prior to committing.\n${codeFence(stdout)}`
            );
        }
    },

    function eslintCheck() {
        const fs = require('fs');
        const eslintJUnitReporter = require('eslint/lib/formatters/junit');
        const stopwatch = timer();
        let stdout;
        try {
            const execa = require('execa');
            ({ stdout } = execa.sync('yarn', [
                'run',
                '--silent',
                'lint',
                '-f',
                'json'
            ]));
        } catch (err) {
            ({ stdout } = err);
        }
        const results = JSON.parse(stdout);
        // TODO: build as XML DOM so we can customize
        const eslintXml = eslintJUnitReporter(results);
        const eslintXmlWithTime = eslintXml.replace(
            /testsuite package="org\.eslint" time="0"/m,
            `testsuite package="org.eslint" time="${stopwatch.stop()}"`
        );
        fs.writeFileSync(reportFile('eslint'), eslintXmlWithTime, 'utf8');

        const errFiles = results
            .filter(r => r.errorCount)
            .map(r => fromRoot(r.filePath));

        if (errFiles.length > 0) {
            fail(
                'The following file(s) did not pass **ESLint**. Execute ' +
                    '`yarn run lint` locally for more details\n' +
                    codeFence(errFiles.join('\n'))
            );
        }
    },

    function unitTests() {
        let summary;
        try {
            summary = require('./test-results.json');
        } catch (e) {
            const execa = require('execa');
            execa.sync('yarn', ['run', '-s', 'test:ci']);
            summary = require('./test-results.json');
        }
        const failedTests = summary.testResults.filter(
            t => t.status !== 'passed'
        );
        if (failedTests.length === 0) {
            return;
        }
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

    // function mergeJunitReports() {
    //     execa.sync('junit-merge', [
    //         '--dir',
    //         reportDir,
    //         '--out',
    //         reportFile('all-junit.xml')
    //     ]);
    // }

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
