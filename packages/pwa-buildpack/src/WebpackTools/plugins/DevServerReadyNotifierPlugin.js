const url = require('url');
const boxen = require('boxen');
const chalk = require('chalk');
const once = require('one-time');
const PostCompileWebpackPlugin = require('post-compile-webpack-plugin');

class DevServerReadyNotifierPlugin {
    constructor(devServer) {
        if (!devServer || !devServer.host || !devServer.port) {
            throw Error(
                'Argument to DevServerReadyNotifierPlugin must be an object with host and port properties.'
            );
        }
        this.url = url.format({
            protocol: devServer.https ? 'https:' : 'http:',
            // webpack-dev-server does not comply with the WHATWG URL
            // format specification that `host` includes a port number,
            // and `hostname` does not
            hostname: devServer.host,
            port: devServer.port
        });
    }
    apply(compiler) {
        const handler = once(() =>
            setImmediate(() =>
                console.log(
                    boxen(
                        chalk.green(
                            'PWADevServer ready at ' +
                                chalk.greenBright.underline(this.url)
                        ),
                        {
                            borderColor: 'gray',
                            float: 'center',
                            align: 'center',
                            margin: 1,
                            padding: 1
                        }
                    )
                )
            )
        );
        new PostCompileWebpackPlugin(handler).apply(compiler);
    }
}

module.exports = DevServerReadyNotifierPlugin;
