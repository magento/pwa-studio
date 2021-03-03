import { useState, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';

export const CREATE_WISHLIST_MUTATION = gql`
    mutation createWishlist(
        $name: String!
        $visibility: WishlistVisibilityEnum!
    ) {
        createWishlist(input: { name: $name, visibility: $visibility }) {
            wishlist {
                id
                name
                visibility
            }
        }
    }
`;

/**
 * @function
 *
 * @returns {CreateWishListProps}
 */
export const useCreateWishlist = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [
        createWishlist,
        { called: setCreateWishlistCalled, loading: setCreateWishlistLoading }
    ] = useMutation(CREATE_WISHLIST_MUTATION);

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
                setIsModalOpen(false);
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
        isModalOpen
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
