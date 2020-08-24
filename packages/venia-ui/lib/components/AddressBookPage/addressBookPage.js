import React from 'react';

import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { Title } from '../Head';
import defaultClasses from './addressBookPage.css';

const PAGE_TITLE = `Address Book`;

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const { data } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            {/* STORE_NAME is injected by Webpack at build time. */}
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            <span>TODO</span>
        </div>
    );
};

export default AddressBookPage;
