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
/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [LocaleProvider, Peregrine, WindowSizeContextProvider, ToastContextProvider];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return (
            <PrintPdfProvider>
                <DownloadCsvProvider>
                    <NoReorderProductProvider>
                        <ContextProvider>{memo}</ContextProvider>
                    </NoReorderProductProvider>
                </DownloadCsvProvider>
            </PrintPdfProvider>
        );
    }, children);
};

export default ContextProvider;
