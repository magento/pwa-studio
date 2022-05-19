import React from 'react';
import { FormattedMessage } from 'react-intl';
import { func, number, shape, string } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './completedView.module.css';
import LinkButton from '../../LinkButton';

const CompletedView = props => {
    const { selectedShippingMethod, showUpdateMode } = props;

    const classes = useStyle(defaultClasses, props.classes);

    let contents;
    if (!selectedShippingMethod) {
        // Error state.
        contents = (
            <span className={classes.error}>
                <FormattedMessage
                    id={'completedView.errorLoading'}
                    defaultMessage={
                        'Error loading selected shipping method. Please select again.'
                    }
                />
            </span>
        );
    } else {
        const { amount, method_title } = selectedShippingMethod;
        const { currency, value } = amount;

        const priceElement = value ? (
            <div>
                <Price value={value} currencyCode={currency} />
            </div>
        ) : (
            <span className={classes.free}>
                <FormattedMessage id={'global.free'} defaultMessage={'Free'} />
            </span>
        );

        contents = (
            <div className={classes.contents}>
                <span>{method_title}</span>
                {priceElement}
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <span className={classes.titleContainer}>
                    <h5 className={classes.heading}>
                        <FormattedMessage
                            id={'completedView.shippingMethod'}
                            defaultMessage={'Shipping Method'}
                        />
                    </h5>
                    <LinkButton
                        className={classes.editButton}
                        onClick={showUpdateMode}
                        data-cy="CompletedView-editButton"
                    >
                        <Icon
                            size={16}
                            src={EditIcon}
                            classes={{ icon: classes.editIcon }}
                        />
                        <span className={classes.editButtonText}>
                            <FormattedMessage
                                id={'global.editButton'}
                                defaultMessage={'Edit'}
                            />
                        </span>
                    </LinkButton>
                </span>
                {contents}
            </div>
        </div>
    );
};

export default CompletedView;

CompletedView.propTypes = {
    classes: shape({
        button: string,
        container: string,
        contents: string,
        editButton: string,
        editButtonText: string,
        editIcon: string,
        error: string,
        free: string,
        heading: string,
        root: string,
        titleContainer: string
    }),
    selectedShippingMethod: shape({
        amount: shape({
            currency: string,
            value: number
        }),
        carrier_code: string,
        carrier_title: string,
        method_code: string,
        method_title: string
    }),
    showUpdateMode: func
};
