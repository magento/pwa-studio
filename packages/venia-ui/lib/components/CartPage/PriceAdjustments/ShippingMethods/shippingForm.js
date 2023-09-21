import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import { useStyle } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';

import Country from '../../../Country';
import FormError from '../../../FormError';
import Region from '../../../Region';
import Postcode from '../../../Postcode';
import defaultClasses from './shippingForm.module.css';

const ShippingForm = props => {
    const { hasMethods, selectedShippingFields, setIsCartUpdating } = props;
    const talonProps = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating
    });
    const {
        errors,
        handleOnSubmit,
        handleZipChange,
        handleOnSubmitKeyPress,
        isSetShippingLoading
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const shippingStatusMessage = isSetShippingLoading
        ? formatMessage({
              id: 'shippingForm.loading',
              defaultMessage: 'Loading Methods...'
          })
        : formatMessage({
              id: 'shippingForm.getShippingOptions',
              defaultMessage: 'Get Shipping Options'
          });

    return (
        <Fragment>
            <h3 className={classes.formTitle}>
                <FormattedMessage
                    id={'shippingForm.formTitle'}
                    defaultMessage={'Destination'}
                />
            </h3>
            <FormError errors={Array.from(errors.values)} />
            <Form
                className={classes.root}
                initialValues={selectedShippingFields}
                onSubmit={handleOnSubmit}
            >
                <Country
                    data-cy="ShippingMethods-ShippingForm-country"
                    validate={isRequired}
                />
                <Region
                    data-cy="ShippingMethods-ShippingForm-region"
                    validate={isRequired}
                />
                <Postcode
                    fieldInput="zip"
                    data-cy="ShippingMethods-ShippingForm-postCode"
                    validate={isRequired}
                    onValueChange={handleZipChange}
                />
                {!hasMethods ? (
                    <Button
                        classes={{
                            root_normalPriority: classes.submit
                        }}
                        data-cy="ShippingMethods-ShippingForm-submit"
                        disabled={isSetShippingLoading}
                        priority="normal"
                        type="submit"
                        onKeyDown={handleOnSubmitKeyPress}
                    >
                        {shippingStatusMessage}
                    </Button>
                ) : null}
            </Form>
        </Fragment>
    );
};

export default ShippingForm;

ShippingForm.propTypes = {
    classes: shape({
        zip: string
    }),
    selectedShippingFields: shape({
        country: string.isRequired,
        region: string.isRequired,
        zip: string.isRequired
    }),
    setIsFetchingMethods: func
};
