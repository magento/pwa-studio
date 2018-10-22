import qs from 'qs';

export const getCreateAccountInitialValues = () =>
    qs.parse(window.location.search, { ignoreQueryPrefix: true });
