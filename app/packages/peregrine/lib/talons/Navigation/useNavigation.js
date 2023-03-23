import { useCallback, useEffect, useMemo, useState } from 'react';

import useInternalLink from '../../hooks/useInternalLink';
import { useAppContext } from '../../context/app';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';
import { useCatalogContext } from '../../context/catalog';
import { useStoreConfigContext } from '../../context/storeConfigProvider';
import { useUserContext } from '../../context/user';

import DEFAULT_OPERATIONS from '../AccountInformationPage/accountInformationPage.gql';
import mergeOperations from '../../util/shallowMerge';

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

export const useNavigation = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerInformationQuery } = operations;
    
    // retrieve app state from context
    const [appState, { closeDrawer }] = useAppContext();
    const [catalogState, { actions: catalogActions }] = useCatalogContext();
    const [, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(getCustomerInformationQuery);

    // request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

        const { data: storeConfigData } = useStoreConfigContext();

    const rootCategoryId = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.root_category_uid;
        }
    }, [storeConfigData]);

    // extract relevant data from app state
    const { drawer } = appState;
    const isOpen = drawer === 'nav';
    const { categories } = catalogState;

    // get local state
    const [view, setView] = useState('MENU');
    const [categoryId, setCategoryId] = useState(rootCategoryId);

    useEffect(() => {
        // On a fresh render with cold cache set the current category as root
        // once the root category query completes.
        if (rootCategoryId && !categoryId) {
            setCategoryId(rootCategoryId);
        }
    }, [categoryId, rootCategoryId]);

    // define local variables
    const category = categories[categoryId];
    const isTopLevel = categoryId === rootCategoryId;
    const hasModal = view !== 'MENU';

    // define handlers
    const handleBack = useCallback(() => {
        const parent = ancestors[view];

        if (parent) {
            setView(parent);
        } else if (category && !isTopLevel) {
            setCategoryId(category.parentId);
        } else {
            closeDrawer();
        }
    }, [category, closeDrawer, isTopLevel, view]);

    const { setShimmerType } = useInternalLink('category');

    const handleClose = useCallback(() => {
        closeDrawer();
        // Sets next root component to show proper loading effect
        setShimmerType();
    }, [closeDrawer, setShimmerType]);

    // create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, [setView]);
    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, [setView]);
    const showMainMenu = useCallback(() => {
        setView('MENU');
    }, [setView]);
    const showMyAccount = useCallback(() => {
        setView('MY_ACCOUNT');
    }, [setView]);
    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
    }, [setView]);

    return {
        catalogActions,
        categoryId,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    };
};
