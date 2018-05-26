/**
 * Run sandboxed JavaScript as an administrator.
 * @module run-as-root
 */

const debug = require('./debug').makeFileLogger(__filename);
const fs = require('./promisified/fs');
const { exec } = require('./promisified/child_process');
const { join } = require('path');
const escapeBashQuotes = str => str.split('"').join('"\'"\'"');
const tmp = () =>
    join(
        __dirname,
        'tmp' +
            Math.random()
                .toString(20)
                .slice(2)
    );

const sudoPromptToRunShell = async (prompt, cmd) => {
    debug(`running "sudo ${cmd}" now...`);
    try {
        const { stdout, stderr } = await exec(
            `sudo -p "${escapeBashQuotes(prompt)}" ${cmd}`
        );
        return stdout + '\n\n' + stderr;
    } catch (e) {
        // Display all values present,
        // without a bunch of extra newlines
        const identity = x => x;
        const fullOutputForError = [e.message || e, e.stderr, e.stdout]
            .filter(identity)
            .join('\n\n');

        const formattedError = new Error(fullOutputForError);

        formattedError.stdout = e.stdout;
        formattedError.stderr = e.stderr;

        throw formattedError;
    }
};

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
 * 2. Prompts user for credentials
 * 3. Runs the temp file with administrative privileges
 * 4. Returns a Promise that fulfills for the stdout of the script.
 *
 * **Warning:** The callback will run in a different process, and will not be
 * able to access any values in enclosed scope. If the function needs a value
 * from the current environment, pass it in through the `args` array and receive
 * it as a parameter.

 * @param {String} prompt Prompt message to display. [sudo -p](https://www.sudo.ws/man/1.8.17/sudo.man.html#p)
 *     variables are interpolated from this string.
 * @param {Function} fn JavaScript code to run. Must be a function. It can take
 *     arguments, which must be passed in order in an array to the following
 *     `args` parameter.
 * @param {Array} args An array of values to be passed as arguments. Must be
 *     serializable to JSON.
 * @returns {Promise<string>} A promise for the console output of the
 *     evaluated code. Rejects if the user did not authorize, or if the code
 *     threw an exception.
 */
module.exports = async (prompt, func, ...args) => {
    if (typeof prompt !== 'string') {
        throw Error('runAsRoot takes a prompt string as its first argument.');
    }
    if (typeof func !== 'function') {
        throw Error('runAsRoot takes a function as its second argument.');
    }
    const codeText = func.toString();
    const scriptLoc = tmp();
    const invoked = `(${codeText})(...${JSON.stringify(args)})`;
    await fs.writeFile(scriptLoc, invoked, 'utf8');
    debug(`elevating privileges for ${codeText}`);
    try {
        return await sudoPromptToRunShell(
            prompt,
            `${process.argv[0]} ${scriptLoc}`
        );
    } finally {
        await fs.unlink(scriptLoc);
    }
};
