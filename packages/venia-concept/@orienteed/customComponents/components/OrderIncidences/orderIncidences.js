import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from '../../css/orderIncidences.module.css';
import { Form } from 'informed';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired, hasIntegerValue, hasEmail } from '../../util/formValidators';
import { useOrderIncidences } from '../../talons/useOrderIncidences';
import FormError from '@magento/venia-ui/lib/components/FormError';
import plusIcon from '../../images/plus.svg';
import OrderIncidence from './orderIncidence.js';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const OrderIncidences = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const { search } = useLocation();
    const history = useHistory();

    const [{ isSignedIn }] = useUserContext();
    if (!isSignedIn) {
        history.push('/');
    }

    const orderNumber = new URLSearchParams(search).get('orderNumber');

    const {
        isLoading,
        successMsg,
        formErrors,
        isDisabledBtn,
        incidences,
        orderItems,
        incidencesImages,
        setIncidencesImages,
        handleSendEmail,
        handleAddNewInsurance
    } = useOrderIncidences({ orderNumber });

    const formMsg = successMsg ? (
        <div className={classes.formSuccess}>
            <FormattedMessage id={'createAccountBeCustomer.success'} defaultMessage={'Email send.'} />
        </div>
    ) : (
        <FormError
            classes={{
                root: classes.formErrors
            }}
            errors={formErrors}
        />
    );

    const incidencesItems = useMemo(() => {
        return incidences.map((incidence, index) => {
            return (
                <OrderIncidence
                    incidence={incidence}
                    orderItems={orderItems}
                    incidencesImages={incidencesImages}
                    setIncidencesImages={setIncidencesImages}
                />
            );
        });
    }, [incidences, orderItems, incidencesImages]);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.content}>
            <label className={[classes.incidencesTitle, classes.incidencesTitleHeader].join(' ')}>
                <FormattedMessage id={'orderIncidences.title'} defaultMessage={'Order Incidences'} />
            </label>
            <Form className={classes.formContent} onSubmit={handleSendEmail}>
                {formMsg}
                <div className={classes.information}>
                    <label className={classes.incidencesTitle}>
                        <FormattedMessage
                            id={'orderIncidences.personalInformation'}
                            defaultMessage={'Personal Information'}
                        />
                    </label>
                    <div className={classes.informationRow}>
                        <Field
                            id="name"
                            label={formatMessage({ id: 'orderIncidences.contactName', defaultMessage: 'Contact Name' })}
                        >
                            <TextInput field="name" id="name" validate={combine([[isRequired, 'name']])} />
                        </Field>
                        <Field
                            id="email"
                            label={formatMessage({ id: 'orderIncidences.email', defaultMessage: 'Contact Email' })}
                        >
                            <TextInput
                                field="email"
                                id="email"
                                validate={combine([[isRequired, 'email'], [hasEmail, 'email']])}
                            />
                        </Field>
                    </div>
                    <div className={classes.informationRow}>
                        <Field
                            id="phone"
                            label={formatMessage({ id: 'orderIncidences.phone', defaultMessage: 'Phone' })}
                        >
                            <TextInput
                                field="phone"
                                id="phone"
                                validate={combine([[isRequired, 'phone'], [hasIntegerValue, 'phone']])}
                            />
                        </Field>
                    </div>
                </div>
                <div className={classes.incidencesContainer}>
                    <div className={classes.incidencesHeader}>
                        <label className={classes.incidencesTitle}>
                            <FormattedMessage id={'orderIncidences.items'} defaultMessage={'Add Product Incidences'} />
                        </label>
                        <label className={classes.orderNumberLabel}>
                            <FormattedMessage id={'orderIncidences.orderNumber'} defaultMessage={'Order Number'} />:
                            <span className={classes.orderNumber}>{orderNumber}</span>
                        </label>
                    </div>
                    <div>{incidencesItems}</div>
                    <div className={classes.incidenceActionsContainer}>
                        <button className={classes.incidenceAction} onClick={handleAddNewInsurance} type="button">
                            <img className={classes.icon} src={plusIcon} alt="plus-icon" />
                        </button>
                    </div>
                </div>
                <div className={classes.submitIncidence}>
                    <Button priority="normal" type="submit" disabled={isDisabledBtn} onClick={handleSendEmail}>
                        <FormattedMessage id={'orderIncidences.sent'} defaultMessage={'Sent email'} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default OrderIncidences;
