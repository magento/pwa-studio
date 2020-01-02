import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

/**
 *
 * @param {*} props.query the footer data query
 */
export const useLogo = props => {
    const { query, defaultSrc, defaultWidth, defaultHeight, defaultAlt } = props;
    const { error, data } = useQuery(query);

    useEffect(() => {
        if (error) {
            console.log('Error fetching logo data.');
        }
    }, [error]);

    let logoSrc;

    if (data && data.storeConfig && data.storeConfig.header_logo_src) {
        logoSrc =
            (data &&
                data.storeConfig &&
                data.storeConfig.secure_base_media_url) +
            'logo/' +
            (data && data.storeConfig && data.storeConfig.header_logo_src);
    } else {
        logoSrc = defaultSrc;
    }

    return {
        configSrc: logoSrc,
        configWidth:
            (data && data.storeConfig && data.storeConfig.logo_width) ||
            defaultWidth,
        configHeight:
            (data && data.storeConfig && data.storeConfig.logo_height) ||
            defaultHeight,
        configAlt:
            (data && data.storeConfig && data.storeConfig.logo_alt) || defaultAlt
    };
};
