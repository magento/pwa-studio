import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import Main from '../main';

jest.mock('../../Header/header', () => 'Header');
jest.mock('../../Footer/footer', () => 'Footer');
jest.mock('../../../classify');

test('it renders correctly when masked', () => {
    const { root } = createTestInstance(<Main isMasked={true} />);

    expect(root.findByProps({ className: 'root_masked' })).toBeTruthy();
    expect(root.findByProps({ className: 'page_masked' })).toBeTruthy();
});

test('sets different classnames when not masked', () => {
    const { root } = createTestInstance(<Main isMasked={false} />);

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findByProps({ className: 'page' })).toBeTruthy();
});
