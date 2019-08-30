/**
 * A Webpack plugin that takes an Async function to execute and
 * halts webpacks execution till the Async function is not completed.
 */
class AsyncWebpackPlugin {
    constructor(callback) {
        if (callback) {
            this.callback = callback;
        } else {
            throw new Error(
                'A callback function needs to be provided while creating an instance of AsyncWebpackPlugin.'
            );
        }
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise('AsyncWebpackPlugin', () => {
            try {
                return this.callback();
            } catch (err) {
                console.error(
                    `Error in AsyncWebpackPlugin while executing ${
                        this.callback ? this.callback.name : 'the callback'
                    }`,
                    err
                );
                return Promise.resolve();
            }
        });
    }
}

module.exports = AsyncWebpackPlugin;
