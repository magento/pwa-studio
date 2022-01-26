import { useEffect, useState } from 'react';
import { string, shape, object, arrayOf } from 'prop-types';

const { matchMedia } = globalThis;

export const useMediaQuery = props => {
    const [styles, setStyles] = useState({});

    const { mediaQueries } = props;

    useEffect(() => {
        if (!mediaQueries) return;

        const mqlList = mediaQueries.map(({ media }) => matchMedia(media));

        const handleMatch = (query, i) => {
            query.matches ? setStyles(mediaQueries[i].style) : setStyles({});
        };

        mqlList.forEach((mql, i) => {
            if (mql.matches) {
                setStyles(mediaQueries[i].style);
            }
            mql.addEventListener('change', query => handleMatch(query, i));
        });

        return () => {
            mqlList.forEach((mql, i) => {
                mql.removeEventListener('change', query =>
                    handleMatch(query, i)
                );
            });
        };
    }, [mediaQueries]);

    return { styles };
};

useMediaQuery.propTypes = {
    mediaQueries: arrayOf(
        shape({
            media: string.isRequired,
            style: object.isRequired
        })
    ).isRequired
};
