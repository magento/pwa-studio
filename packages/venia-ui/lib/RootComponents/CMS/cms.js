import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import cmsPageQuery from '../../queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import RichContent from '../../components/RichContent';
import { number } from 'prop-types';

const CMSPage = props => {
    const { id } = props;
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

    if (data) {
        return (
            <div>
                <RichContent html={data.cmsPage.content} />
            </div>
        );
    }
    return null;
};

CMSPage.propTypes = {
    id: number
};

export default CMSPage;
