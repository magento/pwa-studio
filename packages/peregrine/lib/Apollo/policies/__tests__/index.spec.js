import typePolicies from '../index';

const readField = jest.fn((name, object) => {
    if (typeof object[name] === Array) {
        return object[name].join();
    }
    return object[name];
});

const mergeObjects = jest.fn((a, b) => {
    return Object.assign({}, a, b);
});

const address = {
    city: 'Austin',
    firsname: 'Veronica',
    lastname: 'Costello',
    street: ['11501 Domain Dr', 'Suite 3'],
    postcode: '78758',
    telephone: '555-123-4567'
};

const address2 = {
    city: 'Los Angeles',
    firsname: 'Veronica',
    lastname: 'Costello',
    street: ['3640 Holdrege Ave'],
    postcode: '90016',
    telephone: '555-456-7890'
};

test('provides an object with the correct shape', () => {
    expect(typePolicies).toMatchSnapshot();
});

describe('keyArgs property for Query.fields entries', () => {
    const { cart, customer, customerCart } = typePolicies.Query.fields;
    test('cart keyArgs provides a value', () => {
        expect(cart.keyArgs()).toBeTruthy();
    });
    test('customer keyArgs provides a value', () => {
        expect(customer.keyArgs()).toBeTruthy();
    });
    test('customerCart keyArgs provides a value', () => {
        expect(customerCart.keyArgs()).toBeTruthy();
    });
});

test('SelectedConfigurableOption returns correct key fields base on available data', () => {
    const { SelectedConfigurableOption } = typePolicies;
    expect(SelectedConfigurableOption.keyFields({ id: 1 })).toStrictEqual([
        'id',
        'value_id'
    ]);
    expect(
        SelectedConfigurableOption.keyFields({
            configurable_product_option_uid: 1
        })
    ).toStrictEqual([
        'configurable_product_option_uid',
        'configurable_product_option_value_uid'
    ]);
});

describe('Cart type provides the correct values', () => {
    const { keyFields, fields } = typePolicies.Cart;

    test('keyFields provides a value', () => {
        expect(keyFields()).toBeTruthy();
    });

    test('merges applied_gift_cards correctly', () => {
        const { merge } = fields.applied_gift_cards;

        const existing = [
            {
                code: '12345'
            }
        ];
        const incoming = [
            {
                code: '67890'
            }
        ];

        const final = merge(existing, incoming);

        expect(final).toStrictEqual(incoming);
    });

    test('merges available_payment_methods correctly', () => {
        const { merge } = fields.available_payment_methods;

        const existing = [
            {
                code: 'Code1',
                title: 'Code One'
            }
        ];
        const incoming = [
            {
                code: 'Code2',
                title: 'Code Two'
            }
        ];

        const final = merge(existing, incoming);
        expect(final).toStrictEqual(incoming);
    });

    test('merges items correctly', () => {
        const { merge } = fields.items;

        const existing = [
            {
                id: '12345',
                product: {
                    id: 3
                },
                quantity: 5
            }
        ];

        const incoming = [
            {
                id: '12345',
                product: {
                    id: 3
                },
                quantity: 5
            },
            {
                id: '67890',
                product: {
                    id: 4
                },
                quantity: 1
            }
        ];

        const final = merge(existing, incoming);
        expect(final).toStrictEqual(incoming);
    });

    describe('merging shipping_addresses', () => {
        const { merge } = fields.shipping_addresses;

        test('handles no existing address', () => {
            const existing = undefined;
            const incoming = [address];

            const final = merge(existing, incoming, {
                readField,
                mergeObjects
            });

            // Address is added
            expect(final).toStrictEqual(incoming);
            expect(readField).toHaveBeenCalledTimes(1);
            expect(mergeObjects).toHaveBeenCalledTimes(0);
        });

        test('handles removing address', () => {
            const existing = [address, address2];
            const incoming = [address];

            const final = merge(existing, incoming, {
                readField,
                mergeObjects
            });

            // Address is removed
            expect(final).toStrictEqual(incoming);
            expect(readField).toHaveBeenCalledTimes(3);
            expect(mergeObjects).toHaveBeenCalledTimes(1);
        });

        test('handles modifying existing address', () => {
            const existing = [address, address2];

            const modifiedAddress = Object.assign({}, address, {
                firstname: 'Elvis',
                telephone: '555-123-5813'
            });

            const incoming = [modifiedAddress, address2];

            const final = merge(existing, incoming, {
                readField,
                mergeObjects
            });

            // Address is updated (not added)
            expect(final).toStrictEqual(incoming);
            expect(readField).toHaveBeenCalledTimes(4);
            expect(mergeObjects).toHaveBeenCalledTimes(2);
        });
    });
});

describe('Customer type provides the correct values', () => {
    const { keyFields, fields } = typePolicies.Customer;

    test('keyFields provides a value', () => {
        expect(keyFields()).toBeTruthy();
    });

    test('merge addresses correctly', () => {
        const { merge } = fields.addresses;

        const existing = [address];
        const incoming = [address2];

        const final = merge(existing, incoming);

        expect(final).toStrictEqual(incoming);
    });

    describe('reading cached addresses', () => {
        const { read } = fields.addresses;
        const toReference = jest.fn(id => ({
            referenceTo: id
        }));

        test('no cached address', () => {
            const result = read(undefined, { toReference });

            expect(result).toBeUndefined;
        });

        test('with cached address', () => {
            const cachedAddresses = [address];

            const result = read(cachedAddresses, { toReference });

            expect(result).toStrictEqual(cachedAddresses);
        });

        test('with legacy cached address', () => {
            const legacyAddress = Object.assign({}, address, {
                id: 'CustomerAddress:5'
            });
            const cachedAddresses = [legacyAddress];

            const result = read(cachedAddresses, { toReference });

            expect(toReference).toHaveBeenCalledTimes(1);
            expect(toReference).toHaveBeenCalledWith(legacyAddress.id);

            expect(result).toStrictEqual([
                {
                    referenceTo: 'CustomerAddress:5'
                }
            ]);
        });
    });
});

describe('CustomerAddress type provides the correct values', () => {
    test('merges street field correctly', () => {
        const { merge } = typePolicies.CustomerAddress.fields.street;

        const existing = ['11501 Domain Dr', 'Suite 3'];
        const incoming = ['3640 Holdrege Ave'];

        const result = merge(existing, incoming);

        expect(result).toStrictEqual(incoming);
    });
});

describe('ShippingCartAddress type merges available_shipping_methods correctly', () => {
    const {
        merge
    } = typePolicies.ShippingCartAddress.fields.available_shipping_methods;

    const baseShippingMethod = {
        available: true,
        amount: {
            value: 10
        },
        price_excl_tax: {
            value: 5
        },
        price_incl_tax: {
            value: 6
        }
    };
    const shippingMethod = {
        ...baseShippingMethod,
        carrier_code: 'carrier code 1',
        method_code: 'method code 1'
    };
    const shippingMethod2 = {
        ...baseShippingMethod,
        carrier_code: 'carrier code 2',
        method_code: 'method code 2'
    };

    test('handles no existing available shipping methods', () => {
        const existing = undefined;
        const incoming = [shippingMethod];

        const result = merge(existing, incoming, { readField, mergeObjects });

        expect(result).toStrictEqual(incoming);
    });
    test('handle removing shipping method', () => {
        const existing = [shippingMethod, shippingMethod2];
        const incoming = [shippingMethod];

        const result = merge(existing, incoming, { readField, mergeObjects });

        expect(readField).toHaveBeenCalledTimes(6);
        expect(mergeObjects).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(incoming);
    });

    test('handle updated shipping method', () => {
        const existing = [shippingMethod, shippingMethod2];
        const modifiedShippingMethod = Object.assign({}, shippingMethod, {
            amount: {
                value: 20
            },
            price_excl_tax: {
                value: 10
            },
            price_incl_tax: {
                value: 12
            }
        });

        const incoming = [shippingMethod2, modifiedShippingMethod];

        const result = merge(existing, incoming, { readField, mergeObjects });

        expect(result).toStrictEqual(incoming);
        expect(mergeObjects).toHaveBeenLastCalledWith(
            shippingMethod,
            modifiedShippingMethod
        );
    });
});

describe('CategoryTree type provides the correct values', () => {
    test('merges children fields correctly', () => {
        const { merge } = typePolicies.CategoryTree.fields.children;

        const existing = [
            {
                id: 100,
                name: 'Category 1.0.0',
                children: {
                    id: 101,
                    name: 'Category 1.0.1'
                }
            }
        ];

        const incoming = [
            {
                id: 200,
                name: 'Category 2.0.0',
                children: {
                    id: 201,
                    name: 'Category 2.0.1'
                }
            }
        ];

        const result = merge(existing, incoming);

        expect(result).toStrictEqual(incoming);
    });
});

test('wishlist entities have correct keys', () => {
    const {
        Wishlist,
        WishlistItem,
        SimpleWishlistItem,
        VirtualWishlistItem,
        DownloadableWishlistItem,
        BundleWishlistItem,
        GroupedProductWishlistItem,
        ConfigurableWishlistItem,
        GiftCardWishlistItem,
        SelectedConfigurableOption
    } = typePolicies;
    expect(Wishlist.keyFields({ id: 1 })).toBe('CustomerWishlist:1');
    expect(WishlistItem.keyFields({ id: 1 })).toBe('CustomerWishlistItem:1');
    expect(SimpleWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerSimpleWishlistItem:1'
    );
    expect(VirtualWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerVirtualWishlistItem:1'
    );
    expect(DownloadableWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerDownloadableWishlistItem:1'
    );
    expect(BundleWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerBundleWishlistItem:1'
    );
    expect(GroupedProductWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerGroupedProductWishlistItem:1'
    );
    expect(ConfigurableWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerConfigurableWishlistItem:1'
    );
    expect(GiftCardWishlistItem.keyFields({ id: 1 })).toBe(
        'CustomerGiftCardWishlistItem:1'
    );
    expect(SelectedConfigurableOption.keyFields({ id: 1 })).toStrictEqual([
        'id',
        'value_id'
    ]);
});

test('local customerWishlistProducts field returns expected data', () => {
    const { read } = typePolicies.Query.fields.customerWishlistProducts;
    const existing = jest.fn();

    const defaultValue = read();
    const existingValue = read(existing);

    expect(defaultValue).toMatchInlineSnapshot(`Array []`);
    expect(existingValue).toBe(existing);
});

test('WishlistItems type merges items correctly', () => {
    const { merge } = typePolicies.WishlistItems.fields.items;

    const existing1 = [];
    const incoming1 = [{ name: 'test1' }];

    const result = merge(existing1, incoming1, {
        variables: { currentPage: 1 }
    });
    expect(result).toStrictEqual([{ name: 'test1' }]);

    const existing2 = [{ name: 'test1' }];
    const incoming2 = [{ name: 'test2' }];

    const result2 = merge(existing2, incoming2, {
        variables: { currentPage: 2 }
    });
    expect(result2).toStrictEqual([{ name: 'test1' }, { name: 'test2' }]);
});
