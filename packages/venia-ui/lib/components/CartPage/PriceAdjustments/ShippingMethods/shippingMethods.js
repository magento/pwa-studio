import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'informed';
import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';

import { useStyle } from '../../../../classify';
import Button from '../../../Button';
import ShippingForm from './shippingForm';
import defaultClasses from './shippingMethods.module.css';
import ShippingRadios from './shippingRadios';

/**
 * A child component of the PriceAdjustments component.
 * This component renders the form for adding the shipping method for the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [shippingMethods.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ShippingMethods from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods";
 */
const ShippingMethods = props => {
    const { setIsCartUpdating } = props;
    const {
        hasMethods,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods,
        showForm,
        showFormOnEnter
    } = useShippingMethods();

    const classes = useStyle(defaultClasses, props.classes);

    const radios =
        isShowingForm && hasMethods ? (
            <Fragment>
                <h3 className={classes.prompt}>
                    <FormattedMessage
                        id={'shippingMethods.prompt'}
                        defaultMessage={'Shipping Methods'}
                    />
                </h3>
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
            classes={{
                root_normalPriority: classes.estimateButton
            }}
            data-cy="ShippingMethods-estimateButton"
            onClick={showForm}
            onKeyDown={showFormOnEnter}
        >
            <FormattedMessage
                id={'shippingMethods.estimateButton'}
                defaultMessage={'I want to estimate my shipping'}
            />
        </Button>
    );

    return (
        <div className={classes.root} data-cy="ShippingMethods-root">
            <p className={classes.message}>
                <FormattedMessage
                    id={'shippingMethods.message'}
                    defaultMessage={
                        'For shipping estimates before proceeding to checkout, please provide the Country, State, and ZIP for the destination of your order.'
                    }
                />
            </p>
            {formOrPlaceholder}
        </div>
    );
};

export default ShippingMethods;
