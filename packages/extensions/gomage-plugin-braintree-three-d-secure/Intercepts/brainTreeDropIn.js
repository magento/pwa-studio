/**
 * adding to brainTreeDropIn 3D secure part
 * @param targets
 */
function localIntercept(targets) {
    const {Targetables} = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);

    /**
     * We can disable the logic if you will add to .env param CHECKOUT_BRAINTREE_3D with value false
     */
    if (process.env.CHECKOUT_BRAINTREE_3D != 'false') {
        const brainTreeDropIn = targetables.reactComponent(
            '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/brainTreeDropIn.js'
        );

        /**
         * import 3d secure plugin
         */
        brainTreeDropIn.addImport('{useBraintreeThreeDSecure} from "@gomage/plugin-braintree-three-d-secure"');
        brainTreeDropIn.addImport('{usePriceSummary} from "@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary"');

        /**
         * add hook for getting of client token
         */
        brainTreeDropIn.insertAfterSource(
            'const [dropinInstance, setDropinInstance] = useState();',
            '\n const clientToken = useBraintreeThreeDSecure();' +
            '\n const talonProps = usePriceSummary();'
        );
        /**
         * check if exist clientToken
         */
        brainTreeDropIn.insertAfterSource(
            'const createDropinInstance = useCallback(async () => {',
            '\n if(clientToken){ '
        );
        /**
         * end condition of check if exist clientToken
         */
        brainTreeDropIn.insertAfterSource(
            'return dropinInstance;',
            '\n}'
        );
        /**
         * setting new dependency clientToken to useCallback createDropinInstance hook
         */
        brainTreeDropIn.insertAfterSource(
            '[containerId',
            ' ,clientToken, talonProps.flatData.total.value'
        );


        /**
         * check if exist clientToken
         */
        brainTreeDropIn.insertBeforeSource(
            'const renderDropin = async () => {',
            '\n if(clientToken){ '
        );

        /**
         * end condition of check if exist clientToken
         */
        brainTreeDropIn.insertBeforeSource(
            '}, [createDropinInstance, onReady]);',
            '}  \n'
        );

        /**
         * setting new dependency clientToken to useEffect hook
         */
        brainTreeDropIn.insertAfterSource(
            '[createDropinInstance, onReady',
            ' ,clientToken'
        );


        /**
         * change of value token to client Token
         */
        brainTreeDropIn.insertAfterSource(
            'const dropinInstance = await dropIn.create({\n' +
            '            authorization',
            ':clientToken',
        );

        /**
         * enable 3d secure
         */
        brainTreeDropIn.insertAfterSource(
            'container: `#${containerId}`,',
            '\n  threeDSecure: {amount:talonProps.flatData.total.value},',
        );

        /**
         * update brain tree if total was changes
         */
        brainTreeDropIn.insertBeforeSource(
            'if (isError) {',
            'useEffect(() => {\n' +
            '        if(dropinInstance) {\n' +
            '            dropinInstance.teardown();\n' +
            '        }\n' +
            '    }, [\n' +
            '     talonProps.flatData.total.value,\n' +
            ']);',
        );
    }
}

module.exports = localIntercept;
