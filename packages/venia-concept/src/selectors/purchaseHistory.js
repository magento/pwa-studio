import dressImage from './dress.jpg';

// TODO: implement this helper when purchase details page will be ready.
export const generatePurchaseDetailsPageUrl = () => `/`;

export const getPurchaseHistoryItems = ({ purchaseHistory: { items = [] } }) =>
    items.map(({ item_id, name, date }) => ({
        id: item_id,
        title: name,
        date,
        // TODO: use makeProductMediaPath function to get image src
        imageSrc: dressImage,
        link: generatePurchaseDetailsPageUrl()
    }));

export const isPurchaseHistoryFetching = ({
    purchaseHistory: { isFetching }
}) => isFetching;
