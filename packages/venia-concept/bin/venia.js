#!/usr/bin/env node

const execa = require('execa');

const cwd = require('path').resolve('../', __dirname);

function npmRun(cmd) {
    execa.shell(`npm run -s ${cmd}`, {
        cwd,
        stdio: 'inherit',
        buffer: false
    });
}

const commands = ['build', 'start'];
const command = process.argv.pop();
if (!commands.includes(command)) {
    console.error(
        `Unrecognized command or flag '${command}'. Run 'venia start' to start, or 'venia build' to build.`
    );
}

npmRun(command);
