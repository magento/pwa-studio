process.env.MEMFS_DONT_WARN = true;
const debug = require('debug')('pwa-buildpack:VirtualWebpack');
const webpack = require('webpack');
const path = require('path');
// compatibility with webpack's expectation of memory-fs,
// see https://github.com/streamich/memfs/issues/404
const join = require('memory-fs/lib/join');
const { createFsFromVolume, Volume } = require('memfs');

/**
 * Run Webpack on a virtual output file system, to test build output. The
 * compiler.outputFileSystem will be a virtual filesystem, whose entire
 * contents are dumped out as JSON in the `output` property of the return
 * object.
 *
 * Runs one compilation and returns a Promise for:
 * {
 *   stats, // The stats output object of the Webpack API
 *   output // The JSON output of the virtual filesystem.
 * }
 */
let inc = 0;
async function virtualWebpack(config) {
    const id = `Compiler#${Math.floor(Math.random() * 255)
        .toString(16)
        .toUpperCase() + inc++}`;

    const tagError = originalError =>
        originalError.message.includes(id)
            ? originalError
            : new Error(`${id}: ${originalError.message}`);

    debug('%s constructing with config %O', id, config);

    try {
        const compiler = webpack(config);
        const outputVol = new Volume();

        // without writing to the real filesystem
        compiler.outputFileSystem = createFsFromVolume(outputVol);

        // compatibility with webpack's expectation of memory-fs, see above
        compiler.outputFileSystem.join = join;

        // promisify the signature of `compiler.run()`;
        const result = await new Promise((resolve, reject) => {
            try {
                compiler.run((err, stats) => {
                    try {
                        if (err || stats.hasErrors()) {
                            const fsState = outputVol.toJSON();
                            for (const filename of Object.keys(fsState)) {
                                let contents = fsState[filename].toString();
                                if (contents.length > 23) {
                                    contents = contents.slice(0, 20) + '...';
                                }
                                fsState[filename] = contents;
                            }
                            const compileMessage =
                                (err || stats).toString() +
                                `\n\nvirtual fs state: ${JSON.stringify(
                                    outputVol.toJSON(),
                                    null,
                                    2
                                )}`;
                            throw new Error(compileMessage);
                        } else {
                            // build artifacts should now be in the volume
                            const volJson = outputVol.toJSON();
                            // but they will have absolute paths to the host OS, so...

                            const output = mapRelativePaths(
                                config.context,
                                volJson
                            );
                            debug(
                                `%s complete with output %O`,
                                id,
                                Object.keys(output)
                            );
                            resolve({ stats, output });
                        }
                    } catch (e) {
                        reject(tagError(e));
                    }
                });
            } catch (e) {
                reject(tagError(e));
            }
        });
        return result;
    } catch (e) {
        throw tagError(e);
    }
}

function mapRelativePaths(context, volumeJson) {
    const output = {};
    for (const [filePath, contents] of Object.entries(volumeJson)) {
        output[path.relative(context, filePath)] = contents;
    }
    return output;
}

module.exports = virtualWebpack;
