import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Tabs from '../tabs';
import { TabList } from 'react-tabs';
import { act } from 'react-test-renderer';

Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get: function() {
        return this._scrollHeight || 0;
    },
    set(val) {
        this._scrollHeight = val;
    }
});

jest.mock('@magento/peregrine/lib/util/makeUrl');

jest.mock('@magento/venia-ui/lib/classify');

test('render tabs with no props', () => {
    const component = createTestInstance(<Tabs />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render configured tab', () => {
    const tabProps = {
        tabNavigationAlignment: 'right',
        minHeight: '300px',
        defaultIndex: 0,
        headers: ['Tab 1'],
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '5px',
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };

    const CONTENT = 'Tab 1 content';
    const component = createTestInstance(
        <Tabs {...tabProps}>
            <div>{CONTENT}</div>
        </Tabs>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('render tab and check mouse down modifies state', () => {
    const moveMouse = (fromX, toX) => {
        act(() => {
            tabList.props.onMouseDown({ clientX: fromX });
        });
        act(() => {
            tabList.props.onMouseMove({ clientX: toX });
        });
        act(() => {
            tabList.props.onMouseUp({ clientX: toX });
        });
        act(() => {
            ul.dispatchEvent(new Event('scroll'));
        });
    };

    const tabProps = {
        tabNavigationAlignment: 'right',
        minHeight: '300px',
        headers: ['Tab 1']
    };
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'scroll';
    wrapper.style.width = '200px';
    const ul = document.createElement('ul');
    ul.scrollWidth = 250;
    ul.style.width = '500px';
    wrapper.append(ul);

    const CONTENT = 'Tab 1 content';
    const component = createTestInstance(
        <Tabs {...tabProps}>
            <div>{CONTENT}</div>
        </Tabs>,
        {
            createNodeMock: () => {
                return wrapper;
            }
        }
    );

    const tabList = component.root.findByType(TabList);
    expect(tabList.parent.props.className).toEqual('navigationGradientRight');

    moveMouse(500, 100);
    expect(ul.scrollLeft).toEqual(400);
    expect(tabList.parent.props.className).toEqual('navigationGradientLeft');

    moveMouse(100, 800);
    expect(ul.scrollLeft).toEqual(-300);
    expect(tabList.parent.props.className).toEqual('navigationGradientRight');

    moveMouse(500, 0);
    expect(ul.scrollLeft).toEqual(200);
    expect(tabList.parent.props.className).toEqual('navigationGradientBoth');

    ul.removeEventListener = jest.fn().mockImplementation(() => {});
    act(() => {
        component.unmount();
    });
    expect(ul.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.anything()
    );
});
