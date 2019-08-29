import React from 'react';
import { arrayOf, string } from 'prop-types';
import RichText from '../../../../RichText';

const Html = ({
    html,
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
    cssClasses
}) => {
    cssClasses = cssClasses ? cssClasses : [];
    const doc = document.createElement('div');
    doc.innerHTML = html;
    console.log(doc);
    const dynamicStyles = {
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
    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            <RichText content={html} />
        </div>
    );
};

Html.propTypes = {
    html: string,
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

export default Html;
