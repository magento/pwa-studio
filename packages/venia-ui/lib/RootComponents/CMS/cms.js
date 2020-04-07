import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import cmsPageQuery from '../../queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import RichContent from '../../components/RichContent';
import CategoryList from '../../components/CategoryList';
import { Meta, Title } from '../../components/Head';
import { mergeClasses } from '../../classify';

import defaultClasses from './cms.css';

const CMSPage = props => {
    const { id } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const { loading, error, data } = useQuery(cmsPageQuery, {
        variables: {
            id: Number(id),
            onServer: false
        }
    });

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Page Fetch Error</div>;
    }

    if (loading) {
        return fullPageLoadingIndicator;
    }

    if (!data) {
        return null;
    }

    const { content_heading, title } = data.cmsPage;

    const headingElement =
        content_heading !== '' ? (
            <h1 className={classes.heading}>{content_heading}</h1>
        ) : null;

    let content;
    // Only render <RichContent /> if the page isn't empty and doesn't contain the default CMS Page text.
    if (
        data.cmsPage.content &&
        data.cmsPage.content.length > 0 &&
        !data.cmsPage.content.includes('CMS homepage content goes here.')
    ) {
        content = (
            <Fragment>
                <Title>{title}</Title>
                {headingElement}
                <RichContent html={data.cmsPage.content} />
            </Fragment>
        );
    } else {
        content = <CategoryList title="Shop by category" id={2} />;
    }

    return (
        <Fragment>
            <Meta name="description" content={data.cmsPage.meta_description} />
            {content}
        </Fragment>
    );
};

CMSPage.propTypes = {
    id: number,
    classes: shape({
        heading: string
    })
};

export default CMSPage;
