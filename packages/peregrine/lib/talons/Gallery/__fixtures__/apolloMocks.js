import operations from '../gallery.gql.ee';

export const mockGetWishlistConfig = {
    request: {
        query: operations.getWishlistConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                id: 1,
                magento_wishlist_general_is_enabled: '1',
                enable_multiple_wishlists: '1'
            }
        }
    }
};

export const mockGetWishlistItemsPage1 = {
    request: {
        query: operations.getWishlistItemsQuery,
        variables: {
            currentPage: 1
        }
    },
    result: {
        data: {
            customer: {
                id: null,
                wishlists: [
                    {
                        id: '3',
                        items_v2: {
                            items: [
                                {
                                    id: '14',
                                    product: {
                                        id: 2051,
                                        sku: 'Dress'
                                    }
                                }
                            ],
                            page_info: {
                                current_page: 1,
                                total_pages: 2
                            }
                        }
                    }
                ]
            }
        }
    }
};

export const mockGetWishlistItemsPage2 = {
    request: {
        query: operations.getWishlistItemsQuery,
        variables: {
            currentPage: 2
        }
    },
    result: {
        data: {
            customer: {
                id: null,
                wishlists: [
                    {
                        id: '4',
                        items_v2: {
                            items: [
                                {
                                    id: '15',
                                    product: {
                                        id: 2051,
                                        sku: 'Shirt'
                                    }
                                }
                            ],
                            page_info: {
                                current_page: 2,
                                total_pages: 2
                            }
                        }
                    }
                ]
            }
        }
    }
};
