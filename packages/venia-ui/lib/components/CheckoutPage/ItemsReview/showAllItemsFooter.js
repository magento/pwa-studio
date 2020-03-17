import React from 'react';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';

import defaultClasses from './itemsReview.css';

const ShowAllItemsFooter = props => {
    const classes = mergeClasses(defaultClasses, props.classes || {});

    return (
        <div className={classes.show_all_footer_container}>
            <Button
                className={classes.show_all_items_button}
                onClick={props.onFooterClick}
            >
                Show All Items
            </Button>
        </div>
    );
};

export default ShowAllItemsFooter;
