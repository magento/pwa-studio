import React from 'react';
// import { useIntl } from 'react-intl';

// VISTAS

import { useStyle } from '@magento/venia-ui/lib/classify';

import createCustomer from '../../../services/customer/createCustomer';

import defaultClasses from './supportPage.module.css';

const ContentDialog = props => {
    const classes = useStyle(defaultClasses, props.classes);
    // const { formatMessage } = useIntl();

    return <p className={classes.root}>{createCustomer}</p>;
};

export default ContentDialog;
