import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Adapter from '@magento/venia-ui/lib/components/Adapter';
import { Form } from 'informed';
import store from '../store';
import '@magento/venia-ui/lib/index.module.css';
import 'tailwindcss/tailwind.css';

// Mock browser APIs that components might expect
if (typeof window !== 'undefined') {
    // Ensure URLSearchParams is available with comprehensive methods
    if (!window.URLSearchParams) {
        window.URLSearchParams = class URLSearchParams {
            constructor(search = '') {
                this.params = new Map();
                if (typeof search === 'string') {
                    if (search.startsWith('?')) search = search.slice(1);
                    if (search) {
                        search.split('&').forEach(param => {
                            const [key, value] = param.split('=');
                            if (key)
                                this.params.set(
                                    decodeURIComponent(key),
                                    decodeURIComponent(value || '')
                                );
                        });
                    }
                }
            }
            get(key) {
                return this.params.get(key);
            }
            set(key, value) {
                this.params.set(key, value);
            }
            delete(key) {
                this.params.delete(key);
            }
            has(key) {
                return this.params.has(key);
            }
            append(key, value) {
                this.params.set(key, value);
            }
            toString() {
                const entries = Array.from(this.params.entries());
                return entries
                    .map(
                        ([k, v]) =>
                            `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
                    )
                    .join('&');
            }
            forEach(callback) {
                this.params.forEach(callback);
            }
            keys() {
                return this.params.keys();
            }
            values() {
                return this.params.values();
            }
            entries() {
                return this.params.entries();
            }
        };
    }

    // Create comprehensive URL object mock
    if (!window.URL) {
        window.URL = class URL {
            constructor(url, base) {
                this.href = url || 'http://localhost:9001/?page=1';
                this.origin = 'http://localhost:9001';
                this.protocol = 'http:';
                this.host = 'localhost:9001';
                this.hostname = 'localhost';
                this.port = '9001';
                this.pathname = '/';
                this.search = '?page=1';
                this.hash = '';
            }
            toString() {
                return this.href;
            }
        };
    }

    // Mock location.search and other properties that might be undefined
    try {
        if (!window.location.search || window.location.search === '') {
            Object.defineProperty(window.location, 'search', {
                value: '?page=1',
                writable: true,
                configurable: true
            });
        }
        if (!window.location.pathname || window.location.pathname === '') {
            Object.defineProperty(window.location, 'pathname', {
                value: '/',
                writable: true,
                configurable: true
            });
        }
    } catch (e) {
        // Some browsers don't allow modifying location
        console.warn('Could not mock location properties:', e);
    }

    // Global string replacement protection
    const originalStringReplace = String.prototype.replace;
    String.prototype.replace = function(...args) {
        if (this == null || this === undefined) {
            console.warn('Attempted to call replace on undefined/null value');
            return '';
        }
        return originalStringReplace.apply(this, args);
    };
}

const origin =
    process.env.MAGENTO_BACKEND_URL ||
    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/';

// Form wrapper for components that need form context
const FormWrapper = ({ children }) => {
    return <Form>{children}</Form>;
};

// Router wrapper for components that need routing context
const RouterWrapper = ({ children }) => {
    // Provide initial location with comprehensive data that components might expect
    const initialEntries = [
        {
            pathname: '/',
            search: '?page=1',
            hash: '',
            state: null,
            key: 'default'
        }
    ];

    return (
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
};

export const decorators = [
    Story => (
        <RouterWrapper>
            <Adapter origin={origin} store={store}>
                <FormWrapper>
                    <Story />
                </FormWrapper>
            </Adapter>
        </RouterWrapper>
    )
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    }
};
