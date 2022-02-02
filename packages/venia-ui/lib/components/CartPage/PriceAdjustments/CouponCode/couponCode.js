import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useToasts } from '@magento/peregrine';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';

import { useStyle } from '../../../../classify';

import Button from '../../../Button';
import { Form } from 'informed';
import Field from '../../../Field';
import Icon from '../../../Icon';
import LinkButton from '../../../LinkButton';
import TextInput from '../../../TextInput';

import defaultClasses from './couponCode.module.css';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

/**
 * A child component of the PriceAdjustments component.
 * This component renders a form for addingg a coupon code to the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state for the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [couponCode.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CouponCode from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode";
 */
const CouponCode = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating
    });
    const [, { addToast }] = useToasts();
    const {
        applyingCoupon,
        data,
        errors,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    } = talonProps;
    const { formatMessage } = useIntl();

    const removeCouponError = deriveErrorMessage([
        errors.get('removeCouponMutation')
    ]);

    useEffect(() => {
        if (removeCouponError) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: removeCouponError,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, removeCouponError]);

    if (!data) {
        return null;
    }

    if (errors.get('getAppliedCouponsQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id={'couponCode.errorContainer'}
                    defaultMessage={
                        'Something went wrong. Please refresh and try again.'
                    }
                />
            </div>
        );
    }

    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <Fragment key={code}>
                    <span>{code}</span>
                    <LinkButton
                        className={classes.removeButton}
                        disabled={removingCoupon}
                        data-cy="CouponCode-removeCouponButton"
                        onClick={() => {
                            handleRemoveCoupon(code);
                        }}
                    >
                        <FormattedMessage
                            id={'couponCode.removeButton'}
                            defaultMessage={'Remove'}
                        />
                    </LinkButton>
                </Fragment>
            );
        });

        return <div className={classes.appliedCoupon}>{codes}</div>;
    } else {
        const errorMessage = deriveErrorMessage([
            errors.get('applyCouponMutation')
        ]);

        const formClass = errorMessage
            ? classes.entryFormError
            : classes.entryForm;

        return (
            <Form
                data-cy="CouponCode-form"
                className={formClass}
                onSubmit={handleApplyCoupon}
            >
                <Field
                    id="couponCode"
                    label={formatMessage({
                        id: 'cartPage.couponCode',
                        defaultMessage: 'Coupon Code'
                    })}
                >
                    <TextInput
                        field="couponCode"
                        id={'couponCode'}
                        data-cy="CouponCode-couponCode"
                        placeholder={formatMessage({
                            id: 'couponCode.enterCode',
                            defaultMessage: 'Enter code'
                        })}
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        message={errorMessage}
                    />
                </Field>
                <Field>
                    <Button
                        data-cy="CouponCode-submit"
                        disabled={applyingCoupon}
                        priority={'normal'}
                        type={'submit'}
                    >
                        <FormattedMessage
                            id={'couponCode.apply'}
                            defaultMessage={'Apply'}
                        />
                    </Button>
                </Field>
            </Form>
        );
    }
};

export default CouponCode;
