import React from 'react';

function isElement(element) {
    return React.isValidElement(element);
}

const renderComponent = Comp => {
    return isElement(Comp) ? Comp : <Comp />;
};

export const renderIf = booleanCondition => (IfComp, ElseComp) => {
    if (booleanCondition) {
        return renderComponent(IfComp);
    } else {
        return ElseComp ? renderComponent(ElseComp) : null;
    }
};
