import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import cmsPageQuery from '../../queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import RichContent from '../../components/RichContent';

const CMSPage = props => {
    const { id } = props;
    const [runQuery, queryResponse] = useLazyQuery(cmsPageQuery);
    const { loading, error, data } = queryResponse;

    useEffect(() => {
        runQuery({
            variables: {
                id: Number(id),
                onServer: false
            }
        });
    }, [id, runQuery]);

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

export default CMSPage;
