const SECURITY_HEADER_DEFINITION = 'veniaSecurityHeaders';

module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = { upward: true };
    });

    builtins.transformUpward.tapPromise(async definitions => {
        if (!definitions[SECURITY_HEADER_DEFINITION]) {
            throw new Error(
                `${
                    targets.name
                } could not find its own definition in the emitted upward.yml`
            );
        }

        for (const headerName in definitions[SECURITY_HEADER_DEFINITION]
            .inline) {
            definitions.veniaAppShell.inline.headers.inline[
                headerName
            ] = `${SECURITY_HEADER_DEFINITION}.${headerName}`;
        }
    });
};
