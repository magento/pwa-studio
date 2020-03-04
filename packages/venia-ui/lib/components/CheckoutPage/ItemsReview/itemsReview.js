import React from 'react';

import defaultClasses from './itemsReview.css';

const ItemsReview = () => {
    /**
     * Use talon to get information about items in cart
     * to show a review of them.
     */
    return (
        <div className={defaultClasses.container}>
            <div>Items review will be handled in PWA-406</div>
            <div className={defaultClasses.text_content}>
                Review of Items in Cart
            </div>
        </div>
    );
};

export default ItemsReview;
