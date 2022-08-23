import { useState } from 'react';
import { useIntl } from 'react-intl';

export const useSortTicket = (props = {}) => {
    const { formatMessage } = useIntl();

    const defaultSort = {
        sortId: 'sortItem.createdDesc',
        sortText: formatMessage({
            id: 'sortItem.createdDesc',
            defaultMessage: 'Creation: Most recent'
        }),
        sortAttribute: 'created_at',
        sortDirection: 'desc'
    };
    return useState(() => Object.assign(defaultSort, props));
};
