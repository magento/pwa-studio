import { RetryLink } from '@apollo/client/link/retry';

const isServer = !globalThis.document;

export default function createRetryLink() {
    return new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 5,
            retryIf: error => error && !isServer && navigator.onLine
        }
    });
}
