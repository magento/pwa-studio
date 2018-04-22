/**
 * Run sandboxed JavaScript as an administrator.
 * @module run-as-root
 */

const debug = require('./debug').makeFileLogger(__filename);
const path = require('path');
const { writeFile, unlink } = require('./promisified/fs');
const sudoPrompt = require('sudo-prompt');
const { join } = require('path');
const tmp = () =>
    join(
        __dirname,
        'tmp' +
            Math.random()
                .toString(20)
                .slice(2)
    );

const opts = {
    name: 'Magento PWA Studio',
    icns: path.join(__dirname, '../../buildpack-logo.icns')
};

const sudoPromptToRunShell = async cmd =>
    new Promise((resolve, reject) => {
        debug(`running sudoPrompt("${cmd}") now...`);
        sudoPrompt.exec(cmd, opts, (error, stdout, stderr) => {
            debug(`sudo ${cmd} returned`, { error, stdout, stderr });
            if (error) {
                error.message = [error.message, stderr, stdout]
                    .filter(x => !!x)
                    .join('\n\n');
                return reject(error);
            }
            return resolve(stdout);
        });
    });

/**
 * Prompts the user for an admin password, then runs its callback with
 * administrative privileges.
 *
 * Node should run as an unprivileged user most of the time, but while setting
 * up a workspace and doing system configuration, we might need root access to
 * do one or two things. Normally, you'd do that by creating a different script
 * file with the privileged code, and then create a child Node process under
 * sudo to run that script file:
 *
 *     child_process.exec('sudo node ./different/script/file', callback)
 *
 * This prompts the user for a Sudo password in any TTY attached to the Node
 * process, and waits to run `callback` until the user has authorized or not.
 *
 * This function automates that process.
 *
 * 1. Stringifies its callback and saves it to a temp file
 * 2. Uses OS native auth dialogs to ask the user for credentials
 * 3. Runs the temp file with administrative privileges
 * 4. Returns a Promise that fulfills for the stdout of the script.
 *
 * **Warning:** The callback will run in a different process, and will not be
 * able to access any values in enclosed scope. If the function needs a value
 * from the current environment, pass it in through the `args` array and receive
 * it as a parameter.
 *
 * @param {Function|string} fn JavaScript code to run. Must be a function or a
 *     string that evaluates to a function. It can take arguments, which must be
 *     passed in order in an array to the following `args` parameter.
 * @param {Array} args An array of values to be passed as arguments. Must be
 *     serializable to JSON.
 * @returns {Promise<string>} A promise for the console output of the
 *     evaluated code. Rejects if the user did not authorize, or if the code
 *     threw an exception.
 */
module.exports = async (fn, ...args) => {
    const impl = fn.toString();
    const scriptLoc = tmp();
    const invoked = `(${impl})(...${JSON.stringify(args)})`;
    await writeFile(scriptLoc, invoked, 'utf8');
    debug(`elevating privileges for ${impl}`);
    try {
        const stdout = sudoPromptToRunShell(
            `${process.argv[0]} ${scriptLoc} && rm ${scriptLoc}`
        );
        return stdout;
    } finally {
        await unlink(scriptLoc);
    }
};
