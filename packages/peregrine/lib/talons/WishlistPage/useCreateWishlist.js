import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '../../util/shallowMerge';

import DEFAULT_OPERATIONS from './createWishlist.gql';

/**
 * @function
 *
 * @returns {CreateWishListProps}
 */
export const useCreateWishlist = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { createWishlistMutation, getCustomerWishlistsQuery } = operations;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createWishlist, { error: createWishlistErrors }] = useMutation(
        createWishlistMutation,
        {
            update(
                cache,
                {
                    data: { createWishlist }
                }
            ) {
                const { customer } = cache.readQuery({
                    query: getCustomerWishlistsQuery
                });
                cache.writeQuery({
                    query: getCustomerWishlistsQuery,
                    data: {
                        customer: {
                            ...customer,
                            wishlists: customer.wishlists.concat([
                                createWishlist.wishlist
                            ])
                        }
                    }
                });
            }
        }
    );

    const handleShowModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleHideModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleCreateList = useCallback(
        async data => {
            try {
                await createWishlist({
                    variables: {
                        name: data.name,
                        visibility: data.visibility
                    }
                });
                await setIsModalOpen(false);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [createWishlist, setIsModalOpen]
    );

    return {
        handleCreateList,
        handleHideModal,
        handleShowModal,
        isModalOpen,
        formErrors: [createWishlistErrors]
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Create Wishlist component.
 *
 * @typedef {Object} CreateWishListProps
 *
 * @property {Function} handleCreateList Callback to be called while creating new list
 * @property {Function} handleHideModal Callback to hide the create modal by modifying the value of isModalOpen
 * @property {Function} handleShowModal Callback to show the create modal by modifying the value of isModalOpen
 * @property {Boolean} isModalOpen Boolean which represents if the create modal is open or not
 */
