import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Pagination from '../../Pagination';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './savedCartsToolbar.module.css';

const SavedCartsToolbar = props => {
    const { handlePageSize, handleCurrentPage, currentPage, totalPage } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const savedCartsToolbarPageInfo = (
        <div className={classes.pageInfo}>
            <FormattedMessage
                id={'savedCartsToolbar.cartShowingText'}
                defaultMessage={'Showing ' + currentPage + ' of ' + totalPage}
                values={{
                    currentPage: currentPage,
                    totalPage: totalPage
                }}
            />
        </div>
    );

    const savedCartsToolbarLimiter = (
        <div className={classes.limiter}>
            <span className={classes.limiterLabel}>
                <FormattedMessage id={'savedCartsToolbar.cartShowText'} defaultMessage={'Show'} />
            </span>
            <select id="limiter" className={classes.limiterOptions} onChange={handlePageSize}>
                <option value="5">{'5'}</option>
                <option value="10">{'10'}</option>
                <option value="50">{'50'}</option>
            </select>
            <span className={classes.limiterText}>
                <FormattedMessage id={'savedCartsToolbar.cartPerPageText'} defaultMessage={'per page'} />
            </span>
        </div>
    );

    const pageControl = {
        currentPage: currentPage,
        setPage: handleCurrentPage,
        totalPages: totalPage
    };

    const savedCartsToolbarPages = (
        <div className={classes.savedCartsPagination}>
            <Pagination class="savedCartsPager" pageControl={pageControl} />
        </div>
    );

    return (
        <div className={classes.root}>
            {savedCartsToolbarPageInfo}
            {savedCartsToolbarLimiter}
            {savedCartsToolbarPages}
        </div>
    );
};

export default SavedCartsToolbar;

SavedCartsToolbar.propTypes = {
    classes: shape({
        root: string,
        pageInfo: string,
        limiter: string,
        limiterLabel: string,
        limiterOptions: string,
        limiterText: string,
        savedCartspagination: string
    })
};
