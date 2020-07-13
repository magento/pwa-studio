import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAccountChip = props => {
    const { fallbackText } = props;

    const [{ currentUser, isSignedIn: isUserSignedIn }] = useUserContext();

    const isLoadingUserName = isUserSignedIn && !currentUser.firstname;
    const welcomeMessage = isUserSignedIn
        ? `Hi, ${currentUser.firstname}`
        : fallbackText;

    return {
        isLoadingUserName,
        welcomeMessage
    };
};
