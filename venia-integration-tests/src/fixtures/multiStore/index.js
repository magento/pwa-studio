/**
 * Default store related values
 */
export const defaultStore = {
    defaultView: {
        storeCode: 'default',
        storeName: 'Default Store View'
    },
    viewOne: {
        storeCode: 'view_1',
        storeName: 'View One'
    },
    accessoriesPathname: '/venia-accessories.html',
    topsPathname: '/venia-tops.html',
    product1Pathname: '/carina-cardigan.html',
    categories: ['Tops', 'Bottoms', 'Dresses', 'Accessories'],
    groupName: 'Main Website Store'
};

export const defaultAccessoriesProducts = [
    'Silver Sol Earrings',
    'Augusta Necklace',
    'Carmina Necklace'
];

export const defaultTopsProducts = ['Carina Cardigan'];

/**
 * Second store related values
 */

export const secondStore = {
    viewOne: {
        storeCode: 'view_1_b',
        storeName: 'View One B'
    },
    viewTwo: {
        storeCode: 'view_2_b',
        storeName: 'View Two B'
    },
    accessoriesPathname: '/venia-accessories',
    product2Pathname: '/ombre-infinity-scarf',
    categories: ['Subcategory A', 'Subcategory B'],
    groupName: 'Store B'
};

export const subcategoryAPathname = '/subcategory-a';
export const subcategoryAProducts = [
    'Augusta Earrings',
    'Ombre Infinity Scarf'
];

export const subcategoryBPathname = '/subcategory-b';

export const addItemToCartOperation = 'AddItemToCart';
