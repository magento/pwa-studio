const debug = require('util').debuglog('ECRunner');
const cp = require('child_process');
class ExternalCommandRunner {
    constructor(cmd) {
        this.cmd = cmd;
    }
    run(args, pref = '') {
        const spacedPref = pref && pref + ' ';
        const fullCmd = `${spacedPref}${this.cmd} ${args}`;
        debug(`running ${fullCmd}`);
        return cp.execSync(fullCmd, { encoding: 'utf8' });
    }
    sudo(prompt, cmd) {
        if (prompt && cmd) {
            return this.run(cmd, `sudo -p "${prompt}"`);
        }
        return this.run(cmd || prompt, 'sudo');
    }
}
module.exports = ExternalCommandRunner;
