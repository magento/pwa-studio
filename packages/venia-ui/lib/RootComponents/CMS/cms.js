import React, { useEffect } from 'react';
import { useQuery } from '@magento/peregrine';
import cmsPageQuery from '../../queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import RichContent from "../../components/RichContent";

const CMSPage = props => {
    const { id } = props;
    const [queryResult, queryApi] = useQuery(cmsPageQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    useEffect(() => {
        setLoading(true);
        runQuery({
            variables: {
                id: Number(id),
                onServer: false
            }
        });
    }, [id, runQuery, setLoading]);

    if (error) {
        return <div>Page Fetch Error</div>;
    }

    if (loading) {
        return fullPageLoadingIndicator;
    }

    if (data) {
        return (
            <div>
                <RichContent html={data.cmsPage.content} />
                {/*<CategoryList title="Shop by category" id={2} />*/}
            </div>
        );
    }
    return null;
};

export default CMSPage;
