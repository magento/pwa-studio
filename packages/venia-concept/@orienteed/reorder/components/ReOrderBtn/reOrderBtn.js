import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './reOrderBtn.module.css';
import buttonClasses from '@magento/venia-ui/lib/components/Button/button.module.css';
import useReOrderItems from '@orienteed/reorder/hooks/useReOrderItems';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const ReOrder = props => {
    const { orderNumber } = props;
    const classes = useStyle(defaultClasses, buttonClasses);

    const talonPropsForReOrderItems = useReOrderItems();
    const { handleReOrderClick, isLoading } = talonPropsForReOrderItems;

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.reOrderDiv}>
            <button
                onClick={() => handleReOrderClick(orderNumber)}
                type="button"
                id={orderNumber}
                className={[classes.reOrderBtn, classes.root].join(' ')}
            >
                {'ReOrder'}
            </button>
        </div>
    );
};

export default ReOrder;
