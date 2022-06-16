import { shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './buyShareCartPage.module.css';
import { useShareCartPage } from '@orienteed/buyLaterNotes/talons/useShareCartPage';

const ShareCartPage = props => {
    const talonProps = useShareCartPage();

    const { isLoading } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

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
