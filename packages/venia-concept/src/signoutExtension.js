/**
 * This is a mock extension. Assume this file will be provided by
 * an extension NPM package. For now for the simplicity of the POC
 * I have added this file as part of venia-concept.
 */

export default tapableHooks => {
    tapableHooks.syncOnSignOut.tap('syncOnSignOut', () => {
        alert('Signing Out');
    });
};
