import { useEffect, useState, useRef } from 'react';
import { string, shape, object, arrayOf } from 'prop-types';

const { matchMedia } = globalThis;

/**
 * A hook that will return all matched styles for any given media queries using the
 * matchMedia API (https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 *
 * @param {Object} props
 * @param {Array} props.mediaQueries The array of media rules and respective styles to apply
 *
 * @returns {Object}
 */
export const useMediaQuery = (props = { mediaQueries: [] }) => {
    const [styles, setStyles] = useState({});

    const isMountedRef = useRef(null);

    const { mediaQueries } = props;

    useEffect(() => {
        isMountedRef.current = true;
        if (!mediaQueries) return;

        const mqlList = mediaQueries.map(({ media }) => matchMedia(media));

        const handleMatch = (query, i) => {
            if (!isMountedRef.current) return;

            if (query.matches) {
                setStyles(prevState => ({
                    ...prevState,
                    ...mediaQueries[i].style
                }));
            } else {
                setStyles(prevState => {
                    const filteredState = Object.keys(prevState)
                        .filter(
                            key => mediaQueries[i].style[key] !== prevState[key]
                        )
                        .reduce((obj, key) => {
                            return {
                                ...obj,
                                [key]: prevState[key]
                            };
                        }, {});
                    return filteredState;
                });
            }
        };

        mqlList.forEach((mql, i) => {
            if (mql.matches) {
                setStyles(prevState => ({
                    ...prevState,
                    ...mediaQueries[i].style
                }));
            }
            mql.addEventListener('change', query => handleMatch(query, i));
        });

        return () => {
            isMountedRef.current = false;
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
