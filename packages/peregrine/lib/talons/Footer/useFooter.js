import { useEffect } from 'react';
import { useQuery } from '@magento/peregrine';

/**
 *
 * @param {*} props.query the footer data query
 */
export const useFooter = props => {
    const { query } = props;

    const [{ data, error }, { runQuery, setLoading }] = useQuery(query);

    useEffect(() => {
        const fetchFooter = async () => {
            setLoading(true);
            await runQuery();
            setLoading(false);
        };
        fetchFooter();
    }, [runQuery, setLoading]);

    useEffect(() => {
        if (error) {
            console.log('Error fetching copyright data.');
        }
    }, [error]);

    return {
        copyrightText: data && data.storeConfig && data.storeConfig.copyright
    };
};
