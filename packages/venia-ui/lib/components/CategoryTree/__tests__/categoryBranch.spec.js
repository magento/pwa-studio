import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Branch from '../categoryBranch';

jest.mock('../../../classify');

const props = {
    category: {
        id: 1,
        include_in_menu: 1,
        name: 'One'
    },
    setCategoryId: jest.fn()
};

test('renders correctly', () => {
    const instance = createTestInstance(<Branch {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders null if include flag is off', () => {
    const nextCategory = { ...props.category, include_in_menu: 0 };
    const instance = createTestInstance(
        <Branch {...props} category={nextCategory} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('calls setCategoryId on click', () => {
    const { setCategoryId } = props;
    const { root } = createTestInstance(<Branch {...props} />);

    const button = root.findByProps({ className: 'target' });

    button.props.onClick();

    expect(setCategoryId).toHaveBeenCalledTimes(1);
});
