import React, { useContext, createContext } from 'react';
import { useToastState } from './useToastState';

const ToastContext = createContext();
const { Provider: ToastProvider } = ToastContext;

const ToastContextProvider = ({ children }) => {
    const reducer = useToastState();
    return <ToastProvider value={reducer}>{children}</ToastProvider>;
};

const useToastStore = () => useContext(ToastContext)[0];
const useToastDispatch = () => useContext(ToastContext)[1];

export default ToastContextProvider;
export { useToastDispatch, useToastStore };
