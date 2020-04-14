import React from 'react';
import { withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './switchStore.css';
import { useLocalization } from '@magento/peregrine';

const SwitchStore = props => {
    const [localizationState, { handleSwitchStore }] = useLocalization();
    const { availableStoreViews } = localizationState;

    const switchStore = code => {
        handleSwitchStore(code);
    };

    const classes = mergeClasses(defaultClasses, props.classes);
    return availableStoreViews.map(item => (
        <div className={classes.root} key={item.code}>
            <Button onClick={() => switchStore(item.code.toLowerCase())}>
                {item.name}
            </Button>
        </div>
    ));
};

SwitchStore.propTypes = {
    classes: shape({
        root: string
    }),
    showSwitchStore: func.isRequired
};

export default compose(withRouter)(SwitchStore);
