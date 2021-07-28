import { useAppContext } from '../../context/app';

export default () => {
    const [{ isPageLoading }] = useAppContext();

    return {
        isPageLoading
    };
};
