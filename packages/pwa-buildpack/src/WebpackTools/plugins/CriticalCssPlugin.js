const CssoPlugin = require('csso-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

class CriticalCssPlugin {
    constructor({
        phase,
        pattern = /\.critical\.css/,
        filename = 'critical.css',
        cssLoader = {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                localIdentName: '[name]-[local]-[hash:base64:3]',
                modules: true
            }
        },
        nonCriticalPattern = /\.css$/
    }) {
        this.phase = phase;
        this.pattern = pattern;
        this.filename = filename;
        this.cssLoader = cssLoader;
        this.extractPlugin = new ExtractTextPlugin({
            filename,
            allChunks: true,
            ignoreOrder: true
        });
    }
    load() {
        return {
            oneOf: [
                {
                    test: this.pattern,
                    use: this.extractPlugin.extract({
                        use: this.cssLoader
                    })
                },
                {
                    test: this.nonCriticalPattern,
                    use: ['style-loader', this.cssLoader]
                }
            ]
        };
    }
    apply(compiler) {
        this.extractPlugin.apply(compiler);
        // if (this.phase === 'production') {
            (new CssoPlugin(null, this.pattern)).apply(compiler);
        // }
    }
}

module.exports = CriticalCssPlugin;
