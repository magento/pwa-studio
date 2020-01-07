import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

/**
 *
 * @param query for magento theme logo
 * @param defaultSrc for logo path
 * @param defaultWidth for logo width
 * @param defaultHeight for logo height
 * @param defaultAlt for logo alt text
 */
export const useLogo = props => {
    const {
        query,
        defaultSrc,
        defaultWidth,
        defaultHeight,
        defaultAlt
    } = props;
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
        src: logoSrc,
        logoWidth:
            (data && data.storeConfig && data.storeConfig.logo_width) ||
            defaultWidth,
        logoHeight:
            (data && data.storeConfig && data.storeConfig.logo_height) ||
            defaultHeight,
        alt:
            (data && data.storeConfig && data.storeConfig.logo_alt) ||
            defaultAlt
    };
};
