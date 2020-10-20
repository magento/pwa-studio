import React from 'react';
import { ChevronRight, Copy, Move, Trash2 } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './wishlistItemActions.css';

const WishlistItemActions = props => {
    const { onRemove } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <button>
                <span className={classes.row}>
                    <Icon size={16} src={Move} />
                    <span className={classes.text}>
                        <FormattedMessage
                            id={'wishlistItemActions.move'}
                            defaultMessage={'Move to'}
                        />
                    </span>
                    <Icon size={16} src={ChevronRight} />
                </span>
            </button>
            <button>
                <span className={classes.rowAlternate}>
                    <Icon size={16} src={Copy} />
                    <span className={classes.text}>
                        <FormattedMessage
                            id={'wishlistItemActions.copy'}
                            defaultMessage={'Copy to'}
                        />
                    </span>
                    <Icon size={16} src={ChevronRight} />
                </span>
            </button>
            <button onClick={onRemove}>
                <span className={classes.row}>
                    <Icon size={16} src={Trash2} />
                    <span className={classes.text}>
                        <FormattedMessage
                            id={'wishlistItemActions.delete'}
                            defaultMessage={'Remove'}
                        />
                    </span>
                </span>
            </button>
        </div>
    );
};

export default WishlistItemActions;
