import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import GET_CMS_PAGE from '../../queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';
import RichContent from '../../components/RichContent';
import CategoryList from '../../components/CategoryList';
import { Meta, Title } from '../../components/Head';
import { mergeClasses } from '../../classify';
import { useIntl } from 'react-intl';

import defaultClasses from './cms.css';

const CMSPage = props => {
    const { id } = props;

    const talonProps = useCmsPage({
        id,
        queries: {
            getCmsPage: GET_CMS_PAGE
        }
    });

    const { formatMessage } = useIntl();

    const {
        cmsPage,
        hasContent,
        error,
        shouldShowLoadingIndicator
    } = talonProps;

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    if (error) {
        return <div>Page Fetch Error</div>;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    if (hasContent) {
        const {
            content_heading,
            title,
            meta_title,
            meta_description,
            content
        } = cmsPage;

        const headingElement =
            content_heading !== '' ? (
                <h1 className={classes.heading}>{content_heading}</h1>
            ) : null;

        const pageTitle = meta_title || title;

        return (
            <Fragment>
                <Title>{pageTitle}</Title>
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                {headingElement}
                <RichContent html={content} />
            </Fragment>
        );
    }

    return (
        <CategoryList
            title={formatMessage({
                id: 'cms.shopByCategory',
                defaultMessage: 'Shop by category'
            })}
            id={2}
        />
    );
};

CMSPage.propTypes = {
    id: number,
    classes: shape({
        heading: string
    })
};

export default CMSPage;
