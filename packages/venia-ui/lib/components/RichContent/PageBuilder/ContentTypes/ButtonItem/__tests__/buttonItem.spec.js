import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ButtonItem from '../buttonItem';
import Button from '../../../../../Button/button';

jest.mock('../../../../../../classify');

jest.mock('@magento/venia-drivers', () => ({
    withRouter: jest.fn(arg => arg),
    resourceUrl: jest.fn(),
    Link: jest.fn(() => null)
}));

test('renders a ButtonItem component', () => {
    const component = createTestInstance(<ButtonItem />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a ButtonItem component with all properties configured', () => {
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
        textAlign: 'left'
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('clicking button with external link goes to correct destination in the new tab', () => {
    const buttonItemProps = {
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: true,
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        textAlign: 'initial'
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);
    const button = component.root.findByType(Button);
    window.open = jest.fn().mockImplementation(() => {});
    button.props.onClick();
    expect(window.open).toHaveBeenCalledWith('https://www.adobe.com', '_blank');
});

test('clicking button with external link goes to correct destination', () => {
    const buttonItemProps = {
        link: 'https://www.adobe.com',
        linkType: 'default',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        textAlign: 'initial'
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);
    const button = component.root.findByType(Button);
    window.location.assign = jest.fn();
    button.props.onClick();
    expect(window.location.assign).toBeCalledWith('https://www.adobe.com');
});

test('clicking button with internal link goes to correct destination', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const buttonItemProps = {
        link: 'http://magento.com/test-product.html',
        linkType: 'product',
        openInNewTab: false,
        buttonText: 'Shop Bags',
        buttonType: 'secondary',
        history: {
            push: jest.fn()
        }
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);
    const button = component.root.findByType(Button);
    button.props.onClick();
    expect(buttonItemProps.history.push).toHaveBeenCalledWith(
        '/test-product.html'
    );
});

test('clicking button without link', () => {
    const buttonItemProps = {
        link: ' ',
        linkType: 'product',
        openInNewTab: false,
        buttonText: 'Shop Bags',
        buttonType: 'secondary',
        history: {
            push: jest.fn()
        }
    };
    const component = createTestInstance(<ButtonItem {...buttonItemProps} />);
    const button = component.root.findByType(Button);
    button.props.onClick();
    expect(window.open).toHaveBeenCalledTimes(0);
    expect(buttonItemProps.history.push).toHaveBeenCalledTimes(0);
    expect(window.location.assign).toHaveBeenCalledTimes(0);
});
