import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import defaultClasses from './priceAlert.module.css';
import { useStyle } from '../../../classify';

const PriceAlert = props => {
    const { onCancel, isOpen, selectedVarient, formProps, setFormApi, onConfirm: handleSubmitPriceAlert } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();

    const { formatMessage } = useIntl();

    const modalTitle = formatMessage({
        id: 'productAlerts.priceAlertModal',
        defaultMessage: `Stay tuned for any updates on this product's price!`
    });
    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe Price-Change Alerts now! Register your email address to be the first to know when our product has any changes in price. You are always updated to get product pricing goodness!'
    });
    const modalFooterText = formatMessage({
        id: 'productAlerts.modalFooterText',
        defaultMessage:
            '  Kindly notice that the back-in-stock email will be delivered only one time, and your email address will not be shared or published with anyone else.'
    });
    return (
        <>
            <Dialog
                getApi={setFormApi}
                formProps={formProps}
                confirmTranslationId={'productAlerts.notifyMeText'}
                onCancel={onCancel}
                onConfirm={handleSubmitPriceAlert}
                isOpen={isOpen}
                title={modalTitle}
                confirmText={'Notify me'}
            >
                <hr />
                <p>{modalTextInfo}</p>

                {!isSignedIn && (
                    <Field id="priceAlertFormEmail">
                        <TextInput
                            id="priceAlertFormEmail"
                            data-cy="priceAlertFormEmail-email"
                            field="email"
                            validate={!isSignedIn && isRequired}
                        />
                    </Field>
                )}

                <p>{modalFooterText}</p>
            </Dialog>
        </>
    );
};

export default PriceAlert;
