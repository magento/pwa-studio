import React from 'react';

import { useAccordion } from '@magento/peregrine/lib/talons/Accordion/useAccordion';

import { mergeClasses } from '../../classify';
import defaultClasses from './accordion.css';

const Accordion = props => {
    const { canOpenMultiple, children } = props;

    const talonProps = useAccordion({ canOpenMultiple, children });
    const { childSections } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return <div className={classes.root}>{childSections}</div>;
};

export default Accordion;
