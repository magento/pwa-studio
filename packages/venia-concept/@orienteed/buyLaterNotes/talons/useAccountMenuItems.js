import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_CONFIG_DETAILS } from '../query/buyLaterNotes.gql';

export default original => {
    return function useAccountMenuItems(props, ...restArgs) {
        const [isEnable, setIsEnable] = useState(false);

        // Run the original, wrapped function
        let { ...defaultReturnData } = original(props, ...restArgs);

        const { data } = useQuery(GET_CONFIG_DETAILS, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        });

        useEffect(() => {
            if (data != undefined) {
                const {
                    mpSaveCartConfigs: { enabled }
                } = data;
                setIsEnable(enabled);
            }
        }, [data]);

        if (isEnable) {
            let BUY_LATER_MENU = {
                name: 'Buy Later Notes',
                id: 'accountMenu.buyLaterNotes',
                url: '/mpsavecart'
            };

            defaultReturnData.menuItems.push(BUY_LATER_MENU);
        }

        return {
            ...defaultReturnData
        };
    };
};
