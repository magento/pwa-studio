import { useQuery } from '@apollo/react-hooks';

/**
 *
 * @param {*} props.query the footer data query
 */
export const useFooter = props => {
    const { query } = props;
    const { data } = useQuery(query);

    return {
        copyrightText: data && data.storeConfig && data.storeConfig.copyright
    };
};
