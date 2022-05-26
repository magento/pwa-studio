import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ContactPageShimmer from '../contactPage.shimmer';

jest.mock('../../Shimmer', () => 'Shimmer');
jest.mock('../../../classify', () => ({
    useStyle: (...classes) => Object.assign({}, ...classes)
}));

const classes = {
    shimmer: 'shimmer-class'
};

test('it renders', () => {
    const instance = createTestInstance(
        <ContactPageShimmer classes={classes} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
