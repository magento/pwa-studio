import { shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '../../LoadingIndicator';

import { useShareCartPage } from '@magento/peregrine/lib/talons/BuyLaterNotes/useShareCartPage';

const ShareCartPage = () => {
    const talonProps = useShareCartPage();
    const { isLoading } = talonProps;

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return null;
};

export default ShareCartPage;

ShareCartPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        content: string
    })
};
