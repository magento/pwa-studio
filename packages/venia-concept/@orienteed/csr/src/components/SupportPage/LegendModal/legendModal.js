import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from './Dialog/dialog';

import defaultClasses from './legendModal.module.css';

import supportIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/supportIcon.svg';
import enhancementIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/enhancementIcon.svg';
import orderIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/orderIcon.svg';

const LegendModal = props => {
    const { isOpen, onConfirm } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const supportIssueText = formatMessage({ id: 'csr.supportIssue', defaultMessage: 'Support issue' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const enhancementText = formatMessage({ id: 'csr.enhancement', defaultMessage: 'Enhancement' });
    const legendText = formatMessage({ id: 'csr.legend', defaultMessage: 'Legend' });

    return (
        <Dialog title={legendText} isOpen={isOpen} onCancel={onConfirm}>
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
