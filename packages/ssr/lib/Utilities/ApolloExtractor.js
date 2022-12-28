/**
 * Utility class for extracting Apollo Client state after rendering is done.
 * This can be passed to VeniaAdapter.
 */

class ApolloExtractor {
    constructor() {
        /**
         * @type {import('@apollo/client').ApolloClient}
         * @private
         */
        this.apolloClient = null;

        this.onInit = null;
    }

    setClient(client) {
        this.apolloClient = client;

        if (this.onInit) {
            this.onInit(this.apolloClient);
        }
    }

    setOnInit(onInit) {
        this.onInit = onInit;
    }

    extract() {
        if (!this.apolloClient) {
            return {};
        }

        return this.apolloClient.extract();
    }

    clear() {
        if (!this.apolloClient) {
            return;
        }

        this.apolloClient.clearStore();
    }
}

module.exports = ApolloExtractor;
