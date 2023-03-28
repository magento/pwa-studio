import { RetryLink } from '@apollo/client/link/retry';

export default function createRetryLink() {
    return new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 5,
            retryIf: error => error && !IS_SERVER && navigator.onLine
        }
    });
}
