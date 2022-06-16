import React from 'react';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from '@magento/venia-ui/lib/components/App/localeProvider';
import { DownloadCsvProvider } from '@orienteed/customComponents/components/DownloadCsvProvider/downloadCsvProvider';
import { PrintPdfProvider } from '@orienteed/customComponents/components/PrintPdfProvider/printPdfProvider';

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
                    <ContextProvider>{memo}</ContextProvider>
                </DownloadCsvProvider>
            </PrintPdfProvider>
        );
    }, children);
};

export default ContextProvider;
