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
    const [{ isSignedIn }] = useUserContext();
    const classes = useStyle(defaultClasses, props.classes);
    const { onCancel, isOpen, formProps, onConfirm: handleSubmitPriceAlert, alertConfig } = props;
    console.log({ alertConfig });

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
                formProps={formProps}
                confirmTranslationId={'productAlerts.notifyMeText'}
                onCancel={onCancel}
                onConfirm={handleSubmitPriceAlert}
                isOpen={isOpen}
                title={modalTitle}
                confirmText={alertConfig?.popup_setting?.heading_text}
            >
                <hr />
                <p className={classes.textInfo}>{modalTextInfo}</p>

                {!isSignedIn && (
                    <Field id="priceAlertFormEmail">
                        <TextInput
                            placeholder={alertConfig?.popup_setting?.place_holder}
                            id="priceAlertFormEmail"
                            data-cy="priceAlertFormEmail-email"
                            field="email"
                            validate={!isSignedIn && isRequired}
                        />
                    </Field>
                )}

                <p className={classes.textInfo}>{alertConfig?.popup_setting?.footer_content}</p>
            </Dialog>
        </>
    );
};

export default PriceAlert;
