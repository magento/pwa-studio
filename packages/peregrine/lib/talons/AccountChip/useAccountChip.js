import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * The useAccountChip talon supports the AccountChip component.
 *
 * @returns {Object} talonProps
 * @returns {Object} talonProps.currentUser - Details about the currently signed-in user.
 * @returns {Bool}   talonProps.isLoadingUserName - Indicates when we know there is a
 *  user signed in, but we don't yet have their name.
 * @returns {Bool}   talonProps.isUserSignedIn - Indicates whether we have a signed-in user.
 */
export const useAccountChip = () => {
    const [{ currentUser, isSignedIn: isUserSignedIn }] = useUserContext();

    const isLoadingUserName = isUserSignedIn && !currentUser.firstname;

    return {
        currentUser,
        isLoadingUserName,
        isUserSignedIn
    };
};
