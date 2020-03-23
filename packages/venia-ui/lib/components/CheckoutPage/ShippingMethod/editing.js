import React from 'react';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './editing.css';

const Editing = props => {
    const { onSave } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <>
            <span>Editing!</span>
            <Button onClick={onSave} priority="normal">
                {'Continue to Payment Information'}
            </Button>
        </>
    );
};

export default Editing;
