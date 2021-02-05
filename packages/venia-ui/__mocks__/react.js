import React from 'react';

// React.lazy compiles the "import" to a "require".
const lazyImportPathRegex = new RegExp(/require\('.*?'\)/);

module.exports = {
    ...React,
    lazy: fn => {
        // Rather than just return the entire stringified function, we want to
        // return the component imported. We do this "toString" contains
        // coverage instrumentation comments.
        const fnString = fn.toString();
        const match = fnString.match(lazyImportPathRegex);
        return match ? match[0] : fnString;
    }
};
