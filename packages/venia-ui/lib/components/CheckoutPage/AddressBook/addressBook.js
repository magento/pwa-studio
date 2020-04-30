import React from 'react';

import { mergeClasses } from '../../../classify';
import defaultClasses from './addressBook.css';

const AddressBook = props => {
    const { activeContent, classes: propClasses, toggleActiveContent } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const rootClass =
        activeContent === 'addressBook' ? classes.root_active : classes.root;

    return (
        <div className={rootClass}>
            Woof!
            <button type="button" onClick={toggleActiveContent}>
                Toggle Back
            </button>
        </div>
    );
};

export default AddressBook;
