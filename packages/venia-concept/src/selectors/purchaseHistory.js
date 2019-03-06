const imageSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

// TODO: implement this helper when purchase details page will be ready.
const generatePurchaseDetailsPageUrl = () => `/`;

export const transformItems = (items = []) =>
    items.map(({ item_id, name, date }) => ({
        id: item_id,
        title: name,
        date,
        // TODO: use makeProductMediaPath function to get image src
        imageSrc,
        url: generatePurchaseDetailsPageUrl()
    }));
