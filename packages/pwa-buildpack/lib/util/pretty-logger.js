/**
 * Simple colored console with icons; drop-in replacement for console object.
 * Never uses `console.log` because it logs to stdout, which may be piped to
 * another process to be parsed. Instead, uses only `console.warn()` and
 * `console.error()`, which print to stderr.
 */
const chalk = require('chalk');
const figures = require('figures');
const wordwrap = require('word-wrap');

const formatWith = (level, color, icon) => (str, ...args) =>
    console[level](
        color(
            wordwrap(`${icon}  ${str}`, {
                width: process.stdout.columns - 5,
                trim: true,
                newline: '\n     '
            })
        ),
        ...args
    );

const noFormatting = x => x;

module.exports = {
    log: formatWith('warn', noFormatting, ''),
    warn: formatWith('warn', chalk.yellowBright, figures.warning),
    info: formatWith('warn', chalk.white, figures.info),
    error: formatWith('error', chalk.redBright, figures.circleCross),
    success: formatWith('warn', chalk.greenBright, figures.tick)
};
