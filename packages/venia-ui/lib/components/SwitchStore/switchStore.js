import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useSwitchStore } from '@magento/peregrine/lib/talons/SwitchStore/useSwitchStore';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './switchStore.css';
import i18next from 'i18next';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const SwitchStore = props => {
    const [ appContext, appApi ] = useAppContext();
    let { storeView } = appContext;

    const { handleSwitchStore } = useSwitchStore(props);

    const switchLang = (lang) => {
        storeView = lang;
        const storage = new BrowserPersistence();
        storage.setItem('store_view', lang);
        i18next.changeLanguage(lang);

        window.location.reload('/');
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

export default SwitchStore;

SwitchStore.propTypes = {
    classes: shape({
        root: string
    }),
    showSwitchStore: func.isRequired
};
