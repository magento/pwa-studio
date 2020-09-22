import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './orderProgressBar.css';

const TOTAL_STEPS = 4;

const OrderProgressBar = props => {
    const { status } = props;
    const { formatMessage } = useIntl();
    const statusStepMap = new Map([
        [formatMessage({ id: 'Processing', defaultMessage: 'Processing' }), 1],
        [
            formatMessage({
                id: 'Ready to ship',
                defaultMessage: 'Ready to ship'
            }),
            2
        ],
        [formatMessage({ id: 'Shipped', defaultMessage: 'Shipped' }), 3],
        [formatMessage({ id: 'Delivered', defaultMessage: 'Delivered' }), 4]
    ]);
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
