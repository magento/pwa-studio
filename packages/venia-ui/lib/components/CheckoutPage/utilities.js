import React from 'react';

function isElement(element) {
    return React.isValidElement(element);
}

const renderComponent = Comp => {
    return isElement(Comp) ? Comp : <Comp />;
};

/**
 * If an Else components can be React Components or Elements.
 *
 * React components are useful for lazy rendering.
 */
export const renderIf = booleanCondition => (IfComp, ElseComp) => {
    if (booleanCondition) {
        return renderComponent(IfComp);
    } else {
        return ElseComp ? renderComponent(ElseComp) : null;
    }
};
