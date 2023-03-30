import React from 'react';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from './localeProvider';
import { NoReorderProductProvider } from '../NoReorderProductProvider/noReorderProductProvider';
import { DownloadCsvProvider } from '../Gallery/DownloadCsvProvider/downloadCsvProvider';
import { PrintPdfProvider } from '../CartPage/PrintPdfProvider/printPdfProvider';
import { ModulesProvider } from '@magento/peregrine/lib/context/modulesProvider';
import { StoreConfigProvider } from '@magento/peregrine/lib/context/storeConfigProvider';
/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    StoreConfigProvider,
    LocaleProvider,
    Peregrine,
    WindowSizeContextProvider,
    ToastContextProvider,
    ModulesProvider,
    PrintPdfProvider,
    DownloadCsvProvider,
    NoReorderProductProvider
];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default ContextProvider;
