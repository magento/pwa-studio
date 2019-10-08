import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Buttons from '../Buttons';
import ShallowRenderer from 'react-test-renderer/shallow';
const renderer = new ShallowRenderer();

jest.mock('../../../../../../classify');

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

    const tree = renderer.render(
        <Buttons {...buttonsProps}>
            <div>
                <button>1</button>
            </div>
            <div>
                <button>2</button>
            </div>
        </Buttons>
    );

    expect(tree).toMatchSnapshot();
});
