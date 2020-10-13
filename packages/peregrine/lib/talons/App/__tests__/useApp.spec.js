import React from 'react';
import { createTestInstance } from '@magento/peregrine'

import { useApp } from '../useApp'

const handleError = jest.fn((error) => {})
const handleIsOffline = jest.fn()
const handleIsOnline = jest.fn()
const handleHTMLUpdate = jest.fn()
const markErrorHandled = jest.fn((error)=> {})
const renderError = {}
const unhandledErrors = []


jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
    }

    const api = {}

    const useAppContext = jest.fn(() => [state, api])

    return { useAppContext }
})

const log = jest.fn();

const Component = props => {
    const talonProps = useApp(props);
    log(talonProps);

    return <i />;
}

const mockProps = {
    handleError,
    handleIsOffline,
    handleIsOnline,
    handleHTMLUpdate,
    markErrorHandled,
    renderError,
    unhandledErrors 
}

test('returns the correct shape', () => {
    createTestInstance(<Component {...mockProps} />)

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
})