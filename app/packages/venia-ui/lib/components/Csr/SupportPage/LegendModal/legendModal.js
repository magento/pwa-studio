import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '../../../ConfirmationDialog';

import defaultClasses from './legendModal.module.css';

import supportIcon from '../Icons/supportIcon.svg';
import enhancementIcon from '../Icons/enhancementIcon.svg';
import orderIcon from '../Icons/orderIcon.svg';

const LegendModal = props => {
    const { isOpen, onConfirm } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const supportIssueText = formatMessage({ id: 'csr.supportIssue', defaultMessage: 'Support issue' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const enhancementText = formatMessage({ id: 'csr.enhancement', defaultMessage: 'Enhancement' });
    const legendText = formatMessage({ id: 'csr.legend', defaultMessage: 'Legend' });

    return (
        <Dialog title={legendText} isOpen={isOpen} onCancel={onConfirm} shouldShowButtons={false}>
            <div className={classes.legendModalContainer}>
                <div className={classes.legend}>
                    <img src={supportIcon} className={classes.legendIcon} alt="Support icon" />
                    <p>{supportIssueText}</p>
                </div>
                <div className={classes.legend}>
                    <img src={orderIcon} className={classes.legendIcon} alt="Support icon" />
                    <p>{orderIssueText}</p>
                </div>
                <div className={classes.legend}>
                    <img src={enhancementIcon} className={classes.legendIcon} alt="Support icon" />
                    <p>{enhancementText}</p>
                </div>
            </div>
        </Dialog>
    );
};

export default LegendModal;
