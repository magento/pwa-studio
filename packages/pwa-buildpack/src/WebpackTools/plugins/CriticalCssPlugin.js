const CssoPlugin = require('csso-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

class CriticalCssPlugin {
    constructor({
        mode,
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
        this.mode = mode;
        this.pattern = pattern;
        this.filename = filename;
        this.cssLoader = cssLoader;
        this.nonCriticalPattern = nonCriticalPattern;
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
        // if (this.mode === 'production') {
            (new CssoPlugin(this.pattern)).apply(compiler);
        // }
    }
}

module.exports = CriticalCssPlugin;
