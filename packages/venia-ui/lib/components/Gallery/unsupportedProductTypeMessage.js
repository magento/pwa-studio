import React from 'react';
import { Info } from 'react-feather';

import { FormattedMessage } from 'react-intl';

const InfoIcon = <Icon size={20} src={Info} />;


const UnsupportedProductTypeMessage = props => {
    const talonProps = useUnsupportedProductTypeMessage(props);
    const {
        isUnsupportedProductType, 
        
        
    } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <button className={buttonClass} {...buttonProps}>
            {props.icon} {buttonText}
        </button>
    );
};

export default AddToListButton;

AddToListButton.defaultProps = {
    icon: HeartIcon
};

AddToListButton.propTypes = {
    afterAdd: func,
    beforeAdd: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
