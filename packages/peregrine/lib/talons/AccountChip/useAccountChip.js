import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAccountChip = () => {
    const [{ currentUser, isSignedIn: isUserSignedIn }] = useUserContext();

    const isLoadingUserName = isUserSignedIn && !currentUser.firstname;

    return {
        currentUser,
        isLoadingUserName,
        isUserSignedIn
    };
};
