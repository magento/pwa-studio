import React, { useCallback, useState } from 'react';
import { func, shape, string } from 'prop-types';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useToasts } from '@magento/peregrine';
import { useForm } from '@magento/peregrine/lib/talons/Checkout/useForm';

import { mergeClasses } from '../../classify';
import GET_ALL_COUNTRIES from '../../queries/getAllCountries.graphql';
import Icon from '../Icon';
import LoadingIndicator from '../LoadingIndicator';
import EditableForm from './editableForm';
import Overview from './overview';
import defaultClasses from './form.css';

const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;
const loadingIndicator = (
    <LoadingIndicator>{`Loading Checkout...`}</LoadingIndicator>
);

/**
 * The Form component is similar to Flow in that it renders either the overview
 * or the editable form based on the 'editing' state value.
 */
const Form = props => {
    const { setStep } = props;

    const [, { addToast }] = useToasts();
    const [editing, setEditing] = useState(null);
    const [didShowToast, setDidShowToast] = useState(false);

    const talonProps = useForm({ countriesQuery: GET_ALL_COUNTRIES });
    const { countries, countriesError, isLoadingCountries } = talonProps;

    const handleCountriesError = useCallback(() => {
        if (!didShowToast) {
            addToast({
                type: 'error',
                icon: ErrorIcon,
                message: 'Unable to load checkout. Please try again later.',
                timeout: 3000
            });

            setDidShowToast(true);
        }

        setStep('cart');
    }, [addToast, didShowToast, setStep]);

    const classes = mergeClasses(defaultClasses, props.classes);

    if (countriesError) handleCountriesError();
    if (isLoadingCountries) return loadingIndicator;

    const child = editing ? (
        <EditableForm
            countries={countries}
            editing={editing}
            setEditing={setEditing}
            {...props}
        />
    ) : (
        <Overview classes={classes} {...props} setEditing={setEditing} />
    );

    return <div className={classes.root}>{child}</div>;
};

Form.propTypes = {
    classes: shape({
        root: string
    }),
    setStep: func
};

export default Form;
