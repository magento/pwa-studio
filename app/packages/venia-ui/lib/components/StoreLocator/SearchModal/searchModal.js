import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useStyle } from '../../../classify';
import defaultClasses from './searchModal.module.css';
import Field from '../../Field';
import TextInput from '../../TextInput';
import Button from '../../Button';
import Country from '../../Country';
import Postcode from '../../Postcode';

const SearchModal = props => {
    const { submitSearch, formProps, setFormApi, resetSearch } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const { initialValues } = formProps;
    const nameLabel = formatMessage({
        id: 'global.name',
        defaultMessage: 'Name'
    });
    const streetLabel = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    return (
        <div className={classes.searchWrapper}>
            <div className={classes.formContainer}>
                <Form getApi={setFormApi} onSubmit={submitSearch} initialValues={formProps}>
                    <Field label={nameLabel}>
                        <TextInput id="searchModalName" field="name"  initialValue={initialValues?.name}/>
                    </Field>
                    <Field label={streetLabel}>
                        <TextInput id="searchModalStreet" field="street" initialValue={initialValues?.street} />
                    </Field>
                    <Country id="country" field={'country'} data-cy="country" initialValue={initialValues?.country}/>
                    <Field label={cityLabel}>
                        <TextInput id="searchModalCity" field="city"initialValue={initialValues?.city} />
                    </Field>
                    <Postcode id='postal_code' fieldInput={'postal_code'} data-cy="Postcode"initialValue={initialValues?.postal_code} />
                    <div className={classes.actionWrapper}>
                        <Button type="submit" priority="high">
                            <FormattedMessage id={'searchTrigger.search'} defaultMessage={'Search'} />
                        </Button>{' '}
                        <Button priority="high" type="button" onClick={resetSearch}>
                            <FormattedMessage id={'searchLocator.reset'} defaultMessage={'Reset'} />
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SearchModal;
