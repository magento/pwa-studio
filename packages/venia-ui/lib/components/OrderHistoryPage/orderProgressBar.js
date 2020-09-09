import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './orderProgressBar.css';

const statusStepMap = new Map([
    ['Processing', 1],
    ['Ready to ship', 2],
    ['Shipped', 3],
    ['Delivered', 4]
]);
const TOTAL_STEPS = 4;

const OrderProgressBar = props => {
    const { status } = props;
    const currentStep = statusStepMap.get(status);

    const classes = mergeClasses(defaultClasses, props.classes);

    const stepElements = useMemo(() => {
        const elements = [];
        for (let step = 1; step <= TOTAL_STEPS; step++) {
            const stepClass =
                step <= currentStep ? classes.step_completed : classes.step;
            elements.push(<span key={step} className={stepClass} />);
        }

        return elements;
    }, [classes, currentStep]);

    return <div className={classes.root}>{stepElements}</div>;
};

export default OrderProgressBar;

OrderProgressBar.propTypes = {
    classes: shape({
        root: string,
        step: string,
        step_completed: string
    }),
    status: string.isRequired
};
