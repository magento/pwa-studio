import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import ToolTipIcon from './Icons/tooltip.svg';
import defaultClasses from './toolTip.module.css';
const toolTip = ({ children }) => {
    const classes = useStyle(defaultClasses);
    return (
        <>
            <button className={classes.tooltip}>
                <img className={classes.configrableImg} src={ToolTipIcon} alt="configurable_options" />
                <span className={classes.tooltiptext}>{children}</span>
            </button>
            <br />
        </>
    );
};

export default toolTip;
