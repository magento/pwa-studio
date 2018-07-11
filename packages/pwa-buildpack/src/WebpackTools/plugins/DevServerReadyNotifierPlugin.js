const url = require('url');
const boxen = require('boxen');
const chalk = require('chalk');
const once = require('one-time');
const PostCompileWebpackPlugin = require('post-compile-webpack-plugin');

class DevServerReadyNotifierPlugin {
    constructor(devServer) {
        this.devServer = devServer;
    }
    emitNotification() {
                const { devServer } = this;
                if (!devServer || !devServer.host || !devServer.port) {
                    throw Error(
                        'Argument to DevServerReadyNotifierPlugin must be an object with host and port properties.'
                    );
                }
                const devUrl = url.format({
                    protocol: 'https',
                    // webpack-dev-server does not comply with the WHATWG URL
                    // format specification that `host` includes a port number,
                    // and `hostname` does not
                    hostname: devServer.host,
                    port: devServer.port
                });
                console.log(
                    boxen(
                        chalk.green(
                            'PWADevServer ready at ' +
                                chalk.greenBright.underline(devUrl)
                        ),
                        {
                            borderColor: 'gray',
                            float: 'left',
                            align: 'center',
                            margin: 1,
                            padding: 1
                        }
                    )
                );
            }
    apply(compiler) {
        const handler = once(() => setImmediate(() => this.emitNotification())
        );
        new PostCompileWebpackPlugin(handler).apply(compiler);
    }
}

module.exports = DevServerReadyNotifierPlugin;
