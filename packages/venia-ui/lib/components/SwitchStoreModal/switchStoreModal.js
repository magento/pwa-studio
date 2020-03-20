import React, { useCallback } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import i18next from 'i18next';
import defaultClasses from './switchStoreModal.css';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const SwitchStoreModal = props => {
    const switchLang = (lang, storeView) => {
        const storage = new BrowserPersistence();
        storage.setItem('store_view', lang);
    };

    const classes = mergeClasses(defaultClasses, props.classes);
    return <div className={classes.root}>
        <Button onClick={() => switchLang('fr_ca')}>
            {'Français'}
        </Button>
        <Button onClick={() => switchLang('en_ca')}>
            {'English'}
        </Button>
    </div>;
};

export default SwitchStoreModal;

SwitchStoreModal.propTypes = {
    classes: shape({
        root: string
    })
};
