import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import defaultClasses from './stockAlert.module.css';
import { useStyle } from '../../../classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const StockAlert = props => {
    const [{ isSignedIn }] = useUserContext();
    const { onCancel, isOpen, formProps, onConfirm: submitStockAlert, alertConfig } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe  for product availability. Register your email address to be the first to know when our product has any changes in availability. You are always updated to get product availability!'
    });
    return (
        <>
            <Dialog
                formProps={formProps}
                confirmTranslationId={'productAlerts.notifyMeText'}
                onCancel={onCancel}
                onConfirm={submitStockAlert}
                isOpen={isOpen}
                confirmText={'Notify me'}
                title={alertConfig?.popup_setting?.heading_text}
            >
                <hr />
                <p className={classes.textInfo}>{modalTextInfo}</p>
                {!isSignedIn && (
                    <Field id="email">
                        <TextInput placeholder={alertConfig?.popup_setting?.place_holder} field="email" validate={!isSignedIn && isRequired} data-cy="email" />
                    </Field>
                )}
                <p className={classes.textInfo}>{alertConfig?.popup_setting?.footer_content}</p>
            </Dialog>
        </>
    );
};

export default StockAlert;
