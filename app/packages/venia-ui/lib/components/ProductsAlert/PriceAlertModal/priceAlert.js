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

    const { formatMessage } = useIntl();

    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe Price-Change Alerts now! Register your email address to be the first to know when our product has any changes in price. You are always updated to get product pricing goodness!'
    });
    return (
        <>
            <Dialog
                formProps={formProps}
                onCancel={onCancel}
                onConfirm={handleSubmitPriceAlert}
                isOpen={isOpen}
                title={alertConfig?.popup_setting.heading_text}
                confirmTextButton={alertConfig?.popup_setting?.button_text}
            >
                <hr />
                <p className={classes.textInfo}>{modalTextInfo}</p>

                {!isSignedIn && (
                    <Field
                        id="priceAlertFormEmail"
                        label={formatMessage({
                            id: 'productAlerts.enterEmail',
                            defaultMessage: 'Enter your email to get notified'
                        })}
                    >
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
