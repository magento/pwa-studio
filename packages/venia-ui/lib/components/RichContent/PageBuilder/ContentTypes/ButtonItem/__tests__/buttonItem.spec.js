import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ButtonItem from '../ButtonItem';
jest.mock('../../../../../../classify');

jest.mock('@magento/venia-drivers', () => {
    const withRouter = jest.fn(arg => arg);
    return { withRouter };
});

test('renders a Buttons component', () => {
    const component = createTestInstance(<ButtonItem />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Buttons component with all properties configured', () => {
    const buttonItemProps = {
        buttonType: 'secondary',
        link: '//link.html',
        linkType: 'product',
        openInNewTab: true,
        text: 'button text',
        border: 'solid',
        borderColor: 'rgb(0, 0, 0)',
        borderRadius: '10px',
        borderWidth: '1px',
        cssClasses: ['test-class'],
        marginBottom: '10px',
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '10px',
        textAlign: 'center'
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
