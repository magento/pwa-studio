import React, { Fragment } from 'react';
import { Form } from 'informed';
import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';

import { mergeClasses } from '../../../../classify';
import Button from '../../../Button';
import ShippingForm from './shippingForm';
import defaultClasses from './shippingMethods.css';
import ShippingMethodsOperations from './shippingMethods.gql';
import ShippingRadios from './shippingRadios';

/**
 * Component that renders the Shipping Method form
 * 
 * @param {Object} props Component props
 * @param {Object} props.classes CSS className overrides.
 * See [shippingMethods.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.css}
 * for a list of classes you can override.
 * 
 * @returns {React.Element} A React component that renders the Shipping Method form
 */
const ShippingMethods = props => {
    const { setIsCartUpdating } = props;
    const {
        hasMethods,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods,
        showForm
    } = useShippingMethods({ ...ShippingMethodsOperations });

    const classes = mergeClasses(defaultClasses, props.classes);

    const radios =
        isShowingForm && hasMethods ? (
            <Fragment>
                <h3 className={classes.prompt}>Shipping Methods</h3>
                <Form>
                    <ShippingRadios
                        selectedShippingMethod={selectedShippingMethod}
                        setIsCartUpdating={setIsCartUpdating}
                        shippingMethods={shippingMethods}
                    />
                </Form>
            </Fragment>
        ) : null;

    const formOrPlaceholder = isShowingForm ? (
        <Fragment>
            <ShippingForm
                hasMethods={hasMethods}
                selectedShippingFields={selectedShippingFields}
                setIsCartUpdating={setIsCartUpdating}
            />
            {radios}
        </Fragment>
    ) : (
        <Button
            priority="normal"
            type="button"
            classes={{ root_normalPriority: classes.estimateButton }}
            onClick={showForm}
        >
            {'I want to estimate my shipping'}
        </Button>
    );

    return (
        <div className={classes.root}>
            <p className={classes.message}>
                For shipping estimates before proceeding to checkout, please
                provide the Country, State, and ZIP for the destination of your
                order.
            </p>
            {formOrPlaceholder}
        </div>
    );
};

export default ShippingMethods;
