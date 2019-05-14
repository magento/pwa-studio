import { persistentQueries } from 'src/shared/persistentQueries';

export const getFilterParams = () => {
    const params = new URLSearchParams(window.location.search);
    let titles,
        values = [];

    const urlFilterParams = {};

    for (const key of params.keys()) {
        const cleanKey = key.replace(/\[.*\]/gm, '');
        if (urlFilterParams[cleanKey]) continue;

        /**
         * Filter out persistent queries
         */
        const isPersistent = persistentQueries.filter(
            query => query === cleanKey
        );
        if (isPersistent.length > 0) continue;

        titles = params.getAll(`${cleanKey}[title]`);
        values = params.getAll(`${cleanKey}[value]`);

        urlFilterParams[cleanKey] = titles.map((title, index) => ({
            title: title,
            value: values[index]
        }));
    }

    return urlFilterParams;
};
