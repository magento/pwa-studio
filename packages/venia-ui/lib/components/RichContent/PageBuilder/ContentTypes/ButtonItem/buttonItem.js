import React from 'react';
import Button from '../../../../Button/button';
import { arrayOf, oneOf, string, bool } from 'prop-types';
import { withRouter } from '@magento/venia-drivers';
import resolveLinkProps from '../../resolveLinkProps';
import { compose } from 'redux';

const ButtonItem = props => {
    const {
        buttonType,
        link,
        linkType,
        openInNewTab = false,
        text,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const dynamicInnerStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    let linkProps = {};
    let url = '';
    if (typeof link === 'string') {
        linkProps = resolveLinkProps(link, linkType);
        url = linkProps.to ? linkProps.to : linkProps.href;
    }

    const typeToPriorityMapping = {
        primary: 'high',
        secondary: 'normal',
        link: 'low'
    };

    const handleClick = () => {
        if (openInNewTab) {
            window.open(url, '_blank');
        } else {
            props.history.push(url);
        }
    };

    return (
        <div className={cssClasses.length ? cssClasses.join(' ') : undefined}>
            <Button
                priority={typeToPriorityMapping[buttonType]}
                type="button"
                onClick={handleClick}
                style={dynamicInnerStyles}
            >
                {text}
            </Button>
        </div>
    );
};

ButtonItem.propTypes = {
    buttonType: oneOf(['primary', 'secondary', 'link']),
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    text: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default compose(withRouter)(ButtonItem);
