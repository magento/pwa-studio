/**
 * A Webpack plugin that takes an Async function to execute and
 * halts webpacks execution till the Async function is not completed.
 */
class AsyncWebpackPlugin {
    constructor(callback) {
        this.callback = callback;
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
