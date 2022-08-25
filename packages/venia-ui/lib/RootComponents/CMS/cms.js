import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import CMSPageShimmer from './cms.shimmer';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';
import RichContent from '../../components/RichContent';
import { Meta, StoreTitle } from '../../components/Head';
import { useStyle } from '../../classify';
import { toCamelCase } from '../../util/toCamelCase';

import defaultClasses from './cms.module.css';

const CMSPage = props => {
    const { identifier } = props;

    const talonProps = useCmsPage({ identifier });
    const { cmsPage, shouldShowLoadingIndicator } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return <CMSPageShimmer classes={classes} />;
    }

    const {
        content_heading,
        title,
        meta_title,
        meta_description,
        page_layout,
        content
    } = cmsPage;

    const headingElement =
        content_heading !== '' ? (
            <h1 data-cy="Cms-contentHeading" className={classes.heading}>
                {content_heading}
            </h1>
        ) : null;

    const pageTitle = meta_title || title;
    const rootClassName = page_layout
        ? classes[`root_${toCamelCase(page_layout)}`]
        : classes.root;
    return (
        <Fragment>
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={meta_description} />
            <article className={rootClassName}>
                {headingElement}
                <RichContent html={content} />
            </article>
        </Fragment>
    );
};

CMSPage.propTypes = {
    identifier: string,
    classes: shape({
        root: string,
        heading: string,
        root_empty: string,
        root_1column: string,
        root_2columnsLeft: string,
        root_2columnsRight: string,
        root_3columns: string,
        root_cmsFullWidth: string,
        root_categoryFullWidth: string,
        root_productFullWidth: string
    })
};

export default CMSPage;
