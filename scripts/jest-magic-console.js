/**
 * Spanish console magic. Quiets the console during test reporting, except
 * for console methods called _within tests themselves._
 */

// Turn this whole thing off if we're in debug mode.
if (!process.env.DEBUG && !process.env.NODE_DEBUG) {
    const testFileRE = /(__tests__|__helpers__|__mocks__)/;

    const callerId = require('caller-id');

    // keep a ref to the real console for the real homies
    const realConsole = console;

    // build a fake console using property descriptors
    const descriptors = {};
    // in both node and jsdom, the console methods are own properties, so we
    // can just iterate through them to replace them all
    for (const method of Object.keys(realConsole)) {
        /* eslint-disable no-inner-declarations */
        // declare the function instead of inlining it because we need a
        // reference to it to get the correct stacktrace
        function methodProxy() {
            // use v8 introspection to get a current stack trace, then pop
            // frames off the stack until you're in the function that called
            // this methodProxy, which would be the callsite of `console.log` or
            // whatever console method you use.
            const caller = callerId.getDetailedString(methodProxy);

            // callerId.getDetailedString() returns a string including a path
            // to the calling file, e.g. "render at /path/to/component.js:25"
            // so we test if the calling file path has a __tests__ directory in
            // it (or __helpers__ or __mocks__).

            // so if it's a test file itself calling the console method...
            if (testFileRE.test(caller)) {
                // then let it through!
                return realConsole[method].apply(realConsole, arguments);
            }
            // otherwise, assume that the application code is calling the
            // console, and don't output it.
        }
        /* eslint-enable no-inner-declarations */
        // building the descriptors object method by method
        descriptors[method] = {
            value: methodProxy,
            // the below properties must be true for Jest to spy on and stub
            // out this fake console when it wants to
            configurable: true,
            enumerable: true,
            writable: true
        };
    }
    // we've built a descriptor object subbing console methods with methodProxy

    // now use it to create a new object and override the global console
    // Object.create puts Console in the prototype chain, so any code checking
    // the console's identity will be fooled..
    global.console = Object.create(console, descriptors);
}
