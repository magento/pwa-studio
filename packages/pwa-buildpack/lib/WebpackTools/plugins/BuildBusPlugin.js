class BuildBusPlugin {
    constructor(bus) {
        this.bus = bus;
    }
    apply(compiler) {
        this.bus
            .requestTargets('@magento/pwa-buildpack')
            .get('webpackCompiler')
            .call(compiler);
    }
}

module.exports = BuildBusPlugin;
