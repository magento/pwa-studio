import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useSwitchStore } from '@magento/peregrine/lib/talons/SwitchStore/useSwitchStore';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './switchStore.css';
import i18next from 'i18next';
import { BrowserPersistence } from '@magento/peregrine/lib/util';


const SwitchStore = props => {
    /** 
    const classes = mergeClasses(defaultClasses, props.classes);

    const { handleSwitchStore } = useSwitchStore(props);

    return <div className={classes.root}>
        <Button
            priority="high"
            onClick={handleSwitchStore}
        >
            {i18next.t('Switch Store')}
        </Button>
    </div>;
    */

    const switchLang = (lang, storeView) => {
        const storage = new BrowserPersistence();
        storage.setItem('store_view', lang);
        i18next.changeLanguage(lang);

        window.location.reload(false);
    };

    const classes = mergeClasses(defaultClasses, props.classes);
    return <div className={classes.root}>
        <Button onClick={() => switchLang('fr')}>
            {'Français'}
        </Button>
        <Button onClick={() => switchLang('en')}>
            {'English'}
        </Button>
    </div>;
};

export default SwitchStore;

SwitchStore.propTypes = {
    classes: shape({
        root: string
    }),
    showSwitchStore: func.isRequired
};
