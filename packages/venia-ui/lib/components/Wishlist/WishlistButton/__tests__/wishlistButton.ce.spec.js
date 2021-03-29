import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import WishlistButton from '../wishlistButton.ce';
import { useWishlistButton } from '@magento/peregrine/lib/talons/Wishlist/WishlistButton/useWishlistButton';

import { useToasts } from '@magento/peregrine';

jest.mock('@magento/peregrine', () => ({
    useToasts: jest.fn().mockReturnValue([
        {},
        {
            addToast: jest.fn()
        }
    ])
}));

jest.mock('@magento/venia-ui/lib/classify');

jest.mock(
    '@magento/peregrine/lib/talons/Wishlist/WishlistButton/useWishlistButton',
    () => ({
        useWishlistButton: jest.fn().mockReturnValue({
            addProductError: null,
            handleClick: jest.fn(),
            isDisabled: false,
            isItemAdded: false
        })
    })
);

const defaultProps = {
    itemOptions: {
        sku: 'its-a-sku',
        quantity: 1
    }
};

test('renders the correct tree', () => {
    const tree = createTestInstance(<WishlistButton {...defaultProps} />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <div
          className="root"
        >
          <button
            className="button"
            disabled={false}
            onClick={[MockFunction]}
            type="button"
          >
            <span
              className="wishlistButtonContent"
            >
              <span
                className="root"
              >
                <svg
                  className="icon"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
              </span>
              Add to Favorites
            </span>
          </button>
        </div>
    `);
});

test('renders after item has been added', () => {
    useWishlistButton.mockReturnValueOnce({
        addProductError: null,
        handleClick: jest.fn(),
        isDisabled: true,
        isItemAdded: true
    });
    const tree = createTestInstance(<WishlistButton {...defaultProps} />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <div
          className="root"
        >
          <button
            className="button"
            disabled={true}
            onClick={[MockFunction]}
            type="button"
          >
            <span
              className="wishlistButtonContent_disabled"
            >
              <span
                className="root"
              >
                <svg
                  className="icon"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                  />
                </svg>
              </span>
              Added to Favorites
            </span>
          </button>
        </div>
    `);
});

test('calls addToast if addProductError is truthy', () => {
    const mockAddToast = jest.fn();
    useToasts.mockReturnValueOnce([
        {},
        {
            addToast: mockAddToast
        }
    ]);

    useWishlistButton.mockReturnValueOnce({
        addProductError: new Error('Oopsie!'),
        handleClick: jest.fn(),
        isDisabled: false,
        isItemAdded: false
    });

    createTestInstance(<WishlistButton {...defaultProps} />);

    expect(mockAddToast).toHaveBeenCalled();
});
