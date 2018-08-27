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
                const server = await this.runServer(env);
                const pattern = { crashed };
                if (!isNaN(exitCode)) {
                    pattern.exitCode = exitCode;
                }
                if (stderr) {
                    pattern.stderr = stderr;
                }
                test.match(server, pattern, message);
            })
        );
        test.end();
    }
    async respond(test, cases) {
        const server = await this.runServer();
        test.comment(server);
        test.plan(cases.length * 2);
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
        );
        await server.close();
        test.end();
    }
}

module.exports = PhaseTester;
