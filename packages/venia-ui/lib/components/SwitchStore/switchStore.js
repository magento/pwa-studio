import React from 'react';
import { withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './switchStore.css';
import { useLocalization } from '@magento/peregrine';

const SwitchStore = props => {
    const [ , {handleSwitchLang, _t}] = useLocalization();

    const switchLang = (lang) => {
        handleSwitchLang(lang);
        props.history.push(`/${lang}`);
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

SwitchStore.propTypes = {
    classes: shape({
        root: string
    }),
    showSwitchStore: func.isRequired
};

export default compose(withRouter)(SwitchStore);
