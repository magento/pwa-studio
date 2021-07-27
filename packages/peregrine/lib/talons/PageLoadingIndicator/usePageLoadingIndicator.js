import { useAppContext } from '@magento/peregrine/lib/context/app';

export default () => {
    const [{ isPageLoading }] = useAppContext();

    return {
        isPageLoading
    };
};
