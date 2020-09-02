import { useQuery } from '@apollo/client';
import { Util } from '../../index';
const { BrowserPersistence } = Util;

/**
 *
 * @param {*} props.query the store switcher data query
 */
export const useStoreSwitcher = props => {
    const { query } = props;
    const { data } = useQuery(query);
    const storage = new BrowserPersistence();

    const availableStores = [...data.availableStores].reduce(
        (storeViews, store) => {
            storeViews[store.code] = {
                storeName: store['store_name'],
                locale: store.locale
            };
            return storeViews;
        },
        {}
    );

    const handleSwitchStore = storeCode => {
        storage.setItem('store_view_code', storeCode);
        console.log(storeCode);
    };

    return {
        handleSwitchStore,
        availableStores
    };
};
