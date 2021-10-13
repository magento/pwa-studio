import React, { useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';
import { gql } from '@apollo/client';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useToasts } from '@magento/peregrine';
import { useForm } from '@magento/peregrine/lib/talons/Checkout/useForm';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import LoadingIndicator from '../LoadingIndicator';
import EditableForm from './editableForm';
import Overview from './overview';
import defaultClasses from './form.module.css';

const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;
const loadingText = 'Loading Checkout...';
const loadingIndicator = <LoadingIndicator>{loadingText}</LoadingIndicator>;

/**
 * The Form component is similar to Flow in that it renders either the overview
 * or the editable form based on the 'editing' state value.
 */
const Form = props => {
    const { setStep } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();
    const [editing, setEditing] = useState(null);

    const talonProps = useForm({ countriesQuery: GET_ALL_COUNTRIES });
    const { countries, hasError, isLoading } = talonProps;

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                icon: ErrorIcon,
                message: 'Unable to load checkout. Please try again later.',
                timeout: 3000
            });

            setStep('cart');
        }
    }, [addToast, hasError, setStep]);

    if (isLoading) return loadingIndicator;

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

const GET_ALL_COUNTRIES = gql`
    query getAllCountries {
        countries {
            available_regions {
                code
                id
                name
            }
            id
        }
    }
`;
