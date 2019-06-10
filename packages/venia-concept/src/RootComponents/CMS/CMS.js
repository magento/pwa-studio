import React, { Component } from 'react';
import CategoryList from 'src/components/CategoryList';

// DEBUG
import { useEffect } from 'react';
import { useRestApi } from '@magento/peregrine';
import { loadingIndicator } from 'src/components/LoadingIndicator';

const TestComponent = () => {
    const [restResponse, restApi] = useRestApi('/rest/V1/guest-carts');
    const { data, error, loading } = restResponse;
    const { sendRequest, setLoading } = restApi;

    useEffect(() => {
        const signIn = async () => {
            setLoading(true);

            await sendRequest({
                options: {
                    method: 'POST'
                }
            });

            setLoading(false);
        };

        signIn();
    }, []);

    if (error) return <h1>Error!</h1>;
    if (loading || !data) return loadingIndicator;

    return <span>data: {data}</span>;
};
// DEBUG

export default class CMS extends Component {
    render() {
        return <TestComponent />;
    }
}
