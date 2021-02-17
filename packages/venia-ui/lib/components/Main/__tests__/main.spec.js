import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import Main from '../main';

jest.mock('../../Header/header', () => 'Header');
jest.mock('../../Footer/footer', () => 'Footer');
jest.mock('../../../classify');

test('it renders correctly when masked', () => {
    const props = {
        children: [],
        isMasked: true
    };
    const { root } = createTestInstance(<Main {...props} />);
    const page = root.findByProps({ className: 'page_masked' });

    expect(root.findByProps({ className: 'root_masked' })).toBeTruthy();
    expect(page).toBeTruthy();
    expect(page.props.children).toEqual(props.children);
});

test('sets different classnames when not masked', () => {
    const props = {
        children: [],
        isMasked: false
    };
    const { root } = createTestInstance(<Main {...props} />);
    const page = root.findByProps({ className: 'page' });

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(page).toBeTruthy();
    expect(page.props.children).toEqual(props.children);
});
