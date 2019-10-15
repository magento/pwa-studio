import React, { useEffect, useState } from 'react';
import classes from './ProductRecommendations.css';

/**
 * An extension that displays product recommendations
 */
export const ProductRecommendations = () => {
    const [data, setData] = useState(null);

    // Fake a request for some recommendations data.
    useEffect(() => {
        setTimeout(() => {
            setData({});
        }, 2000);
    });

    const content = !!data ? (
        <div className={classes.tiles}>
            <div className={classes.recommendation}>
                <img
                    src="/media/catalog/product/v/d/vd12-rn_main_2.jpg?auto=webp&format=pjpg&width=240&height=300"
                    alt="product recommendation"
                />
            </div>
            <div className={classes.recommendation}>
                <img
                    src="/media/catalog/product/v/a/va12-ts_main.jpg?auto=webp&format=pjpg&width=240&height=300"
                    alt="product recommendation"
                />
            </div>
            <div className={classes.recommendation}>
                <img
                    src="/media/catalog/product/v/t/vt07-rn_main_2.jpg?auto=webp&format=pjpg&width=240&height=300"
                    alt="product recommendation"
                />
            </div>
        </div>
    ) : (
        <div className={classes.loadingText}>Loading...</div>
    );

    return (
        <div className={classes.root}>
            <span className={classes.text}>Product Recommendations</span>
            {content}
        </div>
    );
};
