import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

/**
 *
 * @param {*} props.query the footer data query
 */
export const useFooter = props => {
    const { query } = props;
    const { error, data } = useQuery(query);

    useEffect(() => {
        if (error) {
            console.log('Error fetching copyright data.');
        }
    }, [error]);

    return {
        copyrightText: data && data.storeConfig && data.storeConfig.copyright
    };
};
