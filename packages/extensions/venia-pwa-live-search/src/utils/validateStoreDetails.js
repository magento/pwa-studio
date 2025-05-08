const validStoreDetailsKeys = [
    'environmentId',
    'environmentType',
    'websiteCode',
    'storeCode',
    'storeViewCode',
    'config',
    'context',
    'apiUrl',
    'apiKey',
    'route',
    'searchQuery'
];

export const sanitizeString = value => {
    // just in case, https://stackoverflow.com/a/23453651
    if (typeof value === 'string') {
        // eslint-disable-next-line no-useless-escape
        value = value.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '');
        return value.trim();
    }
    return value;
};

export const validateStoreDetailsKeys = storeDetails => {
    Object.keys(storeDetails).forEach(key => {
        if (!validStoreDetailsKeys.includes(key)) {
            // eslint-disable-next-line no-console
            console.error(`Invalid key ${key} in StoreDetailsProps`);
            // filter out invalid keys/value
            delete storeDetails[key];
            return;
        }
        storeDetails[key] = sanitizeString(storeDetails[key]);
    });
    return storeDetails;
};
