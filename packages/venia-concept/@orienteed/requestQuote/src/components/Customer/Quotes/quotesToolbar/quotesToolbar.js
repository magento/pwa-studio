import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './quotesToolbar.module.css';
import Pagination from '@magento/venia-ui/lib/components/Pagination';

const quotesToolbar = props => {
    const { pageSize, handlePageSize, handleCurrentPage, currentPage, totalPage } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const quotesToolbarPageInfo = (
        <div className={classes.pageInfo}>
            <FormattedMessage
                id={'quotesToolbar.quotesShowingText'}
                defaultMessage={'Showing ' + currentPage + ' of ' + totalPage}
            />
        </div>
    );

    const quotesToolbarLimiter = (
        <div className={classes.limiter}>
            <span className={classes.limiterLabel}>
                <FormattedMessage id={'quotesToolbar.quotesShowText'} defaultMessage={'Show'} />
            </span>
            <select id="limiter" className={classes.limiterOptions} onChange={handlePageSize}>
                <option value="5" selected={pageSize == 5}>
                    {'5'}
                </option>
                <option value="10" selected={pageSize == 10}>
                    {'10'}
                </option>
                <option value="50" selected={pageSize == 50}>
                    {'50'}
                </option>
            </select>
            <span className={classes.limiterText}>
                <FormattedMessage id={'quotesToolbar.quotesPerpageText'} defaultMessage={'per page'} />
            </span>
        </div>
    );

    const pageControl = {
        currentPage: currentPage,
        setPage: handleCurrentPage,
        totalPages: totalPage
    };

    const quotesToolbarPages = (
        <div className={classes.quotesPagination}>
            <Pagination class="quotesPager" pageControl={pageControl} />
        </div>
    );

    return (
        <div className={classes.root}>
            {quotesToolbarPageInfo}
            {quotesToolbarLimiter}
            {quotesToolbarPages}
        </div>
    );
};

export default quotesToolbar;

quotesToolbar.propTypes = {
    classes: shape({
        root: string,
        pageInfo: string,
        limiter: string,
        limiterLabel: string,
        limiterOptions: string,
        limiterText: string,
        quotesPagination: string
    })
};
