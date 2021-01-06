import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { mergeClasses } from '../../classify';
import Pagination from '../../components/Pagination';
import FilterModal from '../FilterModal';
import Gallery from '../Gallery';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import ProductSort from '../ProductSort';
import Button from '../Button';

import defaultClasses from './searchPage.css';

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSearchPage();

    const {
        data,
        error,
        filters,
        loading,
        openDrawer,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps
    } = talonProps;
    const { formatMessage } = useIntl();

    const [currentSort] = sortProps;

    if (!data) {
        if (loading) return fullPageLoadingIndicator;
        else if (error) {
            return (
                <div className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={
                            'No results found. The search term may be missing or invalid.'
                        }
                    />
                </div>
            );
        }
    }

    let content;
    if (data.products.items.length === 0) {
        content = (
            <div className={classes.noResult}>
                <FormattedMessage
                    id={'searchPage.noResultImportant'}
                    defaultMessage={'No results found!'}
                />
            </div>
        );
    } else {
        content = (
            <Fragment>
                <section className={classes.gallery}>
                    <Gallery items={data.products.items} />
                </section>
                <section className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </section>
            </Fragment>
        );
    }

    const totalCount = data.products.total_count || 0;

    const maybeFilterButtons =
        filters && filters.length ? (
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.filterButton
                }}
                onClick={openDrawer}
                type="button"
            >
                <FormattedMessage
                    id={'searchPage.filterButton'}
                    defaultMessage={'Filter'}
                />
            </Button>
        ) : null;

    const maybeFilterModal =
        filters && filters.length ? <FilterModal filters={filters} /> : null;

    const maybeSortButton = totalCount ? (
        <ProductSort sortProps={sortProps} />
    ) : null;

    const maybeSortContainer = totalCount ? (
        <span className={classes.sortContainer}>
            <FormattedMessage
                id={'searchPage.sortContainer'}
                defaultMessage={'Items sorted by '}
            />
            <span className={classes.sortText}>
                <FormattedMessage
                    id={currentSort.sortId}
                    defaultMessage={currentSort.sortText}
                />
            </span>
        </span>
    ) : null;

    const searchResultsHeading = searchTerm ? (
        <FormattedMessage
            id={'searchPage.searchTerm'}
            values={{
                highlight: chunks => (
                    <span className={classes.headingHighlight}>{chunks}</span>
                ),
                category: searchCategory,
                term: searchTerm
            }}
            defaultMessage={'Showing results:'}
        />
    ) : (
        <FormattedMessage
            id={'searchPage.searchTermEmpty'}
            defaultMessage={'Showing all results:'}
        />
    );

    return (
        <article className={classes.root}>
            <div className={classes.categoryTop}>
                <span className={classes.totalPages}>
                    {formatMessage(
                        {
                            id: 'searchPage.totalPages',
                            defaultMessage: `items`
                        },
                        { totalCount }
                    )}
                </span>
                <div className={classes.headerButtons}>
                    {maybeFilterButtons}
                    {maybeSortButton}
                </div>
                {maybeSortContainer}
            </div>
            <div className={classes.heading}>{searchResultsHeading}</div>
            {content}
            <Suspense fallback={null}>{maybeFilterModal}</Suspense>
        </article>
    );
};

export default SearchPage;

SearchPage.propTypes = {
    classes: shape({
        noResult: string,
        root: string,
        totalPages: string
    })
};
