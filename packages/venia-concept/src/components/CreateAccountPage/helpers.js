import { queryStringToObject } from 'src/util/queryStringHelpers';

export const getCreateAccountInitialValues = () =>
    queryStringToObject(window.location.search);
