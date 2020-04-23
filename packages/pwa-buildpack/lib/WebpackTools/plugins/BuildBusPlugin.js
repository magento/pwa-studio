class BuildBusPlugin {
    constructor(bus, trackingQueue) {
        this.bus = bus;
        this._trackingQueue = trackingQueue;
        this._eventOriginTags = new WeakMap();
    }
    _eventOriginTag(origin) {
        let tag = this._eventOriginTags.get(origin);
        if (!tag) {
            let node = origin;
            const segments = [];
            while (node) {
                segments.unshift(`${node.type}<${node.id}>`);
                node = node.parent;
            }
            tag = segments.join(':');
            this._eventOriginTags.set(origin, tag);
        }
        return tag;
    }
    apply(compiler) {
        if (this._trackingQueue) {
            compiler.hooks.thisCompilation.tap(
                'BuildBusPlugin',
                compilation => {
                    const logger = compilation.getLogger('BuildBusPlugin');
                    const logBusTracking = (origin, eventName, details) => {
                        logger.info(
                            eventName,
                            this._eventOriginTag(origin),
                            details
                        );
                    };
                    this._trackingQueue.forEach(line =>
                        logBusTracking(...line)
                    );
                    this.bus.attach('BuildBusPlugin', logBusTracking);
                }
            );
        }
        this.bus
            .getTargetsOf('@magento/pwa-buildpack')
            .webpackCompiler.call(compiler);
    }
}

module.exports = BuildBusPlugin;
