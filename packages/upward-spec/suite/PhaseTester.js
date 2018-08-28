const { URL } = require('url');
const fetch = require('node-fetch');

class PhaseTester {
    constructor(upwardPath, baseEnv, serverRunner) {
        this.upwardPath = upwardPath;
        this.baseEnv = baseEnv;
        this.serverRunner = serverRunner;
    }
    async runServer(env) {
        return this.serverRunner.run(
            this.upwardPath,
            Object.assign({}, this.baseEnv, env)
        );
    }
    async startup(test, cases) {
        test.plan(cases.length);
        await Promise.all(
            cases.map(async ({ env, crashed, exitCode, stderr, message }) => {
                const server = await this.runServer(env).catch(e =>
                    test.threw(e)
                );
                const pattern = { crashed };
                if (!isNaN(exitCode)) {
                    pattern.exitCode = exitCode;
                }
                if (stderr) {
                    pattern.stderr = stderr;
                }
                test.match(server, pattern, message);
            })
        ).catch(e => test.threw(e));
        return test;
    }
    async respond(test, cases) {
        test.plan(cases.length * 2);
        const server = await this.runServer().catch(e => test.threw(e));
        await Promise.all(
            cases.map(
                async ({ url, fetchOpts, responseProps, text, message }) => {
                    const response = await fetch(
                        new URL(url, server.url),
                        fetchOpts
                    );
                    test.match(response, responseProps, message);
                    const responseText = await response.text();
                    test.match(responseText, text, message);
                }
            )
        ).catch(e => test.threw(e));
        test.tearDown(() => server.close());
        return test;
    }
}

module.exports = PhaseTester;
