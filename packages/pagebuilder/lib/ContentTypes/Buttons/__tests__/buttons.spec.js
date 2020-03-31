import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Buttons from '../buttons';

jest.mock('@magento/venia-ui/lib/classify');

test('renders a Buttons component with stacked appearance', () => {
    const buttonsProps = {
        appearance: 'stacked',
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
    const component = createTestInstance(<Buttons {...buttonsProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Buttons component with inline appearance and same width', () => {
    const buttonsProps = {
        isSameWidth: true,
        appearance: 'inline',
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

    const component = createTestInstance(<Buttons {...buttonsProps} />, {
        createNodeMock: () => {
            return {
                querySelectorAll: jest.fn(() => {
                    return [
                        { offsetWidth: 100 },
                        { offsetWidth: 150 },
                        { offsetWidth: 50 }
                    ];
                })
            };
        }
    });

    expect(component.toJSON()).toMatchSnapshot();
});
