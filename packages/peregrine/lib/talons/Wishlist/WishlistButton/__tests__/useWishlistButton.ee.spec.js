import { renderHook, act } from '@testing-library/react-hooks';

import { useWishlistButton } from '../useWishlistButton.ee';

const initialProps = {
    itemOptions: {
        sku: 'MyProductSku',
        quantity: 1
    }
};

test('returns correct shape', () => {
    const { result } = renderHook(useWishlistButton, { initialProps });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": false,
          "isItemAdded": false,
          "isModalOpen": false,
        }
    `);
});

test('handleButtonClick sets isModalOpen true', () => {
    const { result } = renderHook(useWishlistButton, {
        initialProps
    });

    act(() => result.current.handleButtonClick());

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": true,
          "isItemAdded": false,
          "isModalOpen": true,
        }
    `);
});

test('handleModalClose sets isModalOpen false', () => {
    const { result } = renderHook(useWishlistButton, {
        initialProps
    });

    act(() => result.current.handleButtonClick());

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": true,
          "isItemAdded": false,
          "isModalOpen": true,
        }
    `);

    act(() => result.current.handleModalClose());

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": false,
          "isItemAdded": false,
          "isModalOpen": false,
        }
    `);
});

test('sets isItemAdded and isDisabled to `false` if the item options change', () => {
    const { result, rerender } = renderHook(useWishlistButton, {
        initialProps
    });

    act(() => result.current.handleModalClose(true));

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": true,
          "isItemAdded": true,
          "isModalOpen": false,
        }
    `);

    rerender({
        itemOptions: {
            ...initialProps.itemOptions,
            selected_options: ['foo']
        }
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "handleButtonClick": [Function],
          "handleModalClose": [Function],
          "isDisabled": false,
          "isItemAdded": false,
          "isModalOpen": false,
        }
    `);
});

// test('returns the error from the mutation', async () => {
//     const { result } = renderHookWithProviders({
//         mocks: [addProductToWishlistErrorMock]
//     });

//     await act(async () => await result.current.handleClick());

//     expect(result.current).toMatchInlineSnapshot(`
//         Object {
//           "addProductError": [Error: Oopsie!],
//           "handleClick": [Function],
//           "isDisabled": false,
//           "isItemAdded": false,
//         }
//     `);
// });
