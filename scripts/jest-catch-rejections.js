// Companion to the unhandled rejection captureing environment implemented in
// `./jest-decorate-env`. This file runs after environment setup, so we can now
// subscribe to the global unhandledRejection handler.
if (!process.env.ONLY_SUBSCRIBE_UNHANDLED_REJECTIONS_ONCE) {
    process.on('unhandledRejection', global.promiseRejectionHandler);
    process.env.ONLY_SUBSCRIBE_UNHANDLED_REJECTIONS_ONCE = 1;
}
