import { useCallback } from 'react';

// Wrapper for the useAccountMenu() talon
const wrapUseAccountMenu = useAccountMenu => {
    return props => {
        const talonProps = useAccountMenu(props);

        const { handleSignOut, ...restProps } = talonProps;

        const sdk = window.magentoStorefrontEvents;

        // Need to publish the sign out event before actually calling the original sign out
        // callback to make sure data is sent before the page refreshes
        const newHandleSignOut = useCallback(async () => {
            if (sdk) {
                sdk.publish.signOut();
            }

            handleSignOut();
        }, [sdk, handleSignOut]);

        return {
            handleSignOut: newHandleSignOut,
            ...restProps
        };
    };
};

export default wrapUseAccountMenu;
