import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './orderProgressBar.module.css';

const TOTAL_STEPS = 4;

const OrderProgressBar = props => {
    const { status } = props;
    const { formatMessage } = useIntl();
    const statusStepMap = new Map([
        [
            formatMessage({
                id: 'orderProgressBar.newText',
                defaultMessage: 'new'
            }),
            1
        ],
        [
            formatMessage({
                id: 'orderProgressBar.processingText',
                defaultMessage: 'Progressing'
            }),
            2
        ],
        [
            formatMessage({
                id: 'orderProgressBar.pendingPaymentText',
                defaultMessage: 'pending_payment'
            }),
            3
        ],
        [
            formatMessage({
                id: 'orderProgressBar.paymentReviewText',
                defaultMessage: 'payment_review'
            }),
            3
        ],
        [
            formatMessage({
                id: 'orderProgressBar.deliveredText',
                defaultMessage: 'complete'
            }),
            4
        ],
        [
            formatMessage({
                id: 'orderProgressBar.closedText',
                defaultMessage: 'Closed'
            }),
            0
        ]
    ]);

    const currentStep = statusStepMap.get(status);
    const classes = useStyle(defaultClasses, props.classes);

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
