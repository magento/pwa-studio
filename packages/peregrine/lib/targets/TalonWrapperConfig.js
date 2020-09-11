const path = require('path');

/**
 * A registry of Peregrine talons you can wrap custom code around. An instance
 * of this class is made available when you use Peregrine's `talons` target.
 */
class TalonWrapperConfig {
    /** @hideconstructor */
    constructor(addTransforms) {
        /**
         * Provides access to the talon used in Venia's ProductFullDetail UI component.
         *  @instance
         */
        this.ProductFullDetail = {
            /**
             * {@link WrappableTalon} object for the `useProductFullDetail()` talon
             *
             * @type {WrappableTalon}
             */
            useProductFullDetail: new WrappableTalon(
                addTransforms,
                'ProductFullDetail/useProductFullDetail'
            )
        };
        /**
         * Provides access to the talon used in Venia's App UI component.
         * @instance
         */
        this.App = {
            /**
             * useApp {@link WrappableTalon} object for the `useApp()` talon
             * @type {WrappableTalon}
             */
            useApp: new WrappableTalon(addTransforms, 'App/useApp')
        };
        /**
         * Provides access to the talon used in Venia's Checkout UI component.
         * @instance
         */
        this.Checkout = {
            /**
             * useOverview {@link WrappableTalon} object for the `useOverview()` talon
             * useFlow {@link WrappableTalon} object for the `useFlow()` talon
             * @type {WrappableTalon}
             */
            useOverview: new WrappableTalon(addTransforms, 'Checkout/useOverview'),
            useFlow: new WrappableTalon(addTransforms, 'Checkout/useFlow')
        };
        /**
         * Provides access to the talon used in Venia's MiniCart UI component.
         * @instance
         */
        this.MiniCart = {
            /**
             * useMiniCart {@link WrappableTalon} object for the `useMiniCart()` talon
             * @type {WrappableTalon}
             */
            useMiniCart: new WrappableTalon(addTransforms, 'MiniCart/useMiniCart')
        };
        /**
         * Provides access to the talon used in Venia's MyAccount UI component.
         * @instance
         */
        this.MyAccount = {
            /**
             * useMyAccount {@link WrappableTalon} object for the `useOverview()` talon
             * @type {WrappableTalon}
             */
            useMyAccount: new WrappableTalon(addTransforms, 'MyAccount/useMyAccount')
        };
        /**
         * Provides access to the talon used in Venia's SignIn UI component.
         * @instance
         */
        this.SignIn = {
            /**
             * useSignin {@link WrappableTalon} object for the `useSignin()` talon
             * @type {WrappableTalon}
             */
            useSignIn: new WrappableTalon(addTransforms, 'SignIn/useSignIn')
        };
    }
}

module.exports = TalonWrapperConfig;

/**
 * A particular Peregrine talon implementation which can be decorated with
 * custom JavaScript before it is added to the PWA bundle and imported by React
 * components.
 */
class WrappableTalon {
    /** @hideconstructor */
    constructor(addTransform, talonFile) {
        this.addTransform = addTransform;
        this.fileToTransform = path.join('./lib/talons/', talonFile);
        this.exportName = path.basename(talonFile, '.js');
    }
    /**
     * Pass this talon function through a [wrapper module](#wrapper_modules) before exporting it.
     *
     * @param {string} wrapperModule Import path to the wrapper module. Should be package-absolute.
     */
    wrapWith(wrapperModule) {
        this.addTransform({
            type: 'source',
            fileToTransform: this.fileToTransform,
            transformModule:
                '@magento/pwa-buildpack/lib/WebpackTools/loaders/wrap-esm-loader',
            options: {
                wrapperModule,
                exportName: this.exportName
            }
        });
    }
}
