import React, { useEffect } from 'react';
import { Link } from 'src/drivers';
import { useQuery } from '@magento/peregrine';
import RichText from 'src/components/RichText';
import CategoryList from 'src/components/CategoryList';
import cmsPageQuery from 'src/queries/getCmsPage.graphql';
import { fullPageLoadingIndicator } from 'src/components/LoadingIndicator';

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
                <Link to="/experience/arctic-surfing-in-lofoten">
                    experience/arctic-surfing-in-lofoten
                </Link>
                <RichText content={data.cmsPage.content} />
                <CategoryList title="Shop by category" id={2} />
            </div>
        );
    }
    return null;
};

export default CMSPage;
