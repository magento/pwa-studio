/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const colorBuckets = [
    {
        count: 5,
        title: 'Green',
        __typename: 'ScalarBucket'
    },
    {
        count: 4,
        title: 'Black',
        __typename: 'ScalarBucket'
    },
    {
        count: 3,
        title: 'Blue',
        __typename: 'ScalarBucket'
    },
    {
        count: 2,
        title: 'Gray',
        __typename: 'ScalarBucket'
    },
    {
        count: 1,
        title: 'Pink',
        __typename: 'ScalarBucket'
    },
    {
        count: 0,
        title: 'Yellow',
        __typename: 'ScalarBucket'
    }
];

const sizeBuckets = [
    {
        count: 2,
        title: '32',
        __typename: 'ScalarBucket'
    },
    {
        count: 2,
        title: '33',
        __typename: 'ScalarBucket'
    },
    {
        count: 1,
        title: 'L',
        __typename: 'ScalarBucket'
    }
];

const priceBuckets = [
    {
        title: '0.0-25.0',
        __typename: 'RangeBucket',
        from: 0,
        to: 25,
        count: 45
    },
    {
        title: '25.0-50.0',
        __typename: 'RangeBucket',
        from: 25,
        to: 50,
        count: 105
    },
    {
        title: '75.0-100.0',
        __typename: 'RangeBucket',
        from: 75,
        to: 100,
        count: 6
    },
    {
        title: '200.0-225.0',
        __typename: 'RangeBucket',
        from: 200,
        to: 225,
        count: 2
    }
];

export const mockFilters = [
    {
        title: 'Color',
        attribute: 'color',
        buckets: colorBuckets,
        __typename: 'ScalarBucket'
    },
    {
        title: 'Size',
        attribute: 'size',
        buckets: sizeBuckets,
        __typename: 'ScalarBucket'
    }
];

export const mockColorFilter = {
    title: 'Color',
    attribute: 'color',
    buckets: colorBuckets,
    __typename: 'ScalarBucket'
};

export const mockPriceFilter = {
    title: 'Price',
    attribute: 'price',
    buckets: priceBuckets,
    __typename: 'RangeBucket'
};
