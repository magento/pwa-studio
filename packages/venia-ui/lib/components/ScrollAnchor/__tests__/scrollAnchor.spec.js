/* eslint-disable react/jsx-no-literals */
import React, { useRef } from 'react';

import { createTestInstance } from '@magento/peregrine';

import ScrollAnchor from '../scrollAnchor';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useImperativeHandle: jest.fn(),
    useRef: jest.fn()
}));

const scrollIntoView = jest.fn();
const anchorRef = {
    current: { scrollIntoView }
};

beforeAll(() => {
    useRef.mockReturnValue(anchorRef);
});

test('should render properly', () => {
    const instance = createTestInstance(
        <ScrollAnchor>
            <div>{'Child Component'}</div>
        </ScrollAnchor>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
