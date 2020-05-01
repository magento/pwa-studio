import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { Form, Text } from 'informed';

import { useQuantity } from '../useQuantity';

// Could not figure out fakeTimers. Just mock debounce and call callback.
jest.mock('lodash.debounce', () => {
    return callback => args => callback(args);
});

const log = jest.fn();
const Component = props => {
    const talonProps = useQuantity({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i id={'target'} {...talonProps} />;
};

test('disables inc/dec buttons if no value', () => {
    let formApi;

    createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} />
        </Form>
    );

    act(() => {
        formApi.setValue('quantity', undefined);
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
            isDecrementDisabled: true,
            isIncrementDisabled: true
        })
    );
});

test('enables increment button but not decrement button if there is a value', () => {
    let formApi;

    createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} />
        </Form>
    );

    act(() => {
        formApi.setValue('quantity', 1);
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
            isDecrementDisabled: true,
            isIncrementDisabled: false
        })
    );
});

test('enables both increment and decrement if value is > 1', () => {
    let formApi;

    createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} />
        </Form>
    );

    act(() => {
        formApi.setValue('quantity', 2);
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
            isDecrementDisabled: false,
            isIncrementDisabled: false
        })
    );
});

test('handleDecrement decrements quantity', () => {
    let formApi;
    const onChange = jest.fn();

    const tree = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} onChange={onChange} />
        </Form>
    );
    act(() => {
        formApi.setValue('quantity', 2);
    });

    act(() => {
        tree.root.findByProps({ id: 'target' }).props.handleDecrement();
    });

    expect(formApi.getValue('quantity')).toBe(1);
});

test('handleIncrement increments quantity', () => {
    let formApi;
    const onChange = jest.fn();

    const tree = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} onChange={onChange} />
        </Form>
    );
    act(() => {
        formApi.setValue('quantity', 1);
    });

    act(() => {
        tree.root.findByProps({ id: 'target' }).props.handleIncrement();
    });

    expect(formApi.getValue('quantity')).toBe(2);
});

test('handleBlur only changes quantity if different from previous quantity', () => {
    let formApi;
    const onChange = jest.fn();

    const tree = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component initialValue={1} min={0} onChange={onChange} />
        </Form>
    );

    act(() => {
        tree.root.findByProps({ id: 'target' }).props.handleBlur();
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
        formApi.setValue('quantity', 2);
    });

    act(() => {
        tree.root.findByProps({ id: 'target' }).props.handleBlur();
    });

    expect(onChange).toHaveBeenNthCalledWith(1, 2);
});

test('maskInput callback masks input to minimum value', () => {
    const tree = createTestInstance(
        <Form>
            <Text field="quantity" />
            <Component min={0} />
        </Form>
    );

    expect(tree.root.findByProps({ id: 'target' }).props.maskInput(-1)).toBe(0);
});

test('quantity should update if initialValue prop changes', () => {
    let formApi;

    const tree = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="quantity" />
            <Component min={0} initialValue={0} />
        </Form>
    );

    expect(formApi.getValue('quantity')).toBe(0);

    act(() => {
        tree.update(
            <Form
                getApi={api => {
                    formApi = api;
                }}
            >
                <Text field="quantity" />
                <Component min={0} initialValue={5} />
            </Form>
        );
    });

    expect(formApi.getValue('quantity')).toBe(5);
});
