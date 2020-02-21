const { inspect } = require('util');
class BuildBusPlugin {
    constructor(bus, trackingQueue) {
        this.bus = bus;
        this._trackingQueue = trackingQueue;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('BuildBusPlugin', compilation => {
            const logger = compilation.getLogger('BuildBusPlugin');
            const logBusTracking = (...args) => logger.log(inspect(args));
            this._trackingQueue.forEach(line => logBusTracking(...line));
            this.bus.identify('BuildBusPlugin', logBusTracking);
        });
        this.bus
            .getTargetsOf('@magento/pwa-buildpack')
            .webpackCompiler.call(compiler);
    }
}

module.exports = BuildBusPlugin;
