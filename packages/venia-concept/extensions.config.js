/**
 * Extensions config generator gets these objects as part of
 * options object:
 *
 * { mode, env, projectRoot }
 */
module.exports = function(options) {
    const { env } = options;
    /**
     * Mocking logo replacement config
     */
    env.ENABLE_CUSTOM_LOGO = 1;

    return {
        'sample-venia-loader-icon': {
            'logo.svg': {
                replaceLogo: env.ENABLE_CUSTOM_LOGO === 1,
                variation: 'swimmingGoose'
            }
        }
    };
};
