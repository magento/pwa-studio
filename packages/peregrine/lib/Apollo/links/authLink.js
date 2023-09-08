import { ApolloLink } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();
var token = storage.getItem('signin_token') || null;
var gg = 'dd';
export class MagentoGQLCacheLink extends ApolloLink {
    // The token get reinstantiated on refresh.
    // If we have an existing token value from a previous browsing session, use it.
    
    request(operation, forward) {
        operation.setContext(previousContext => {
            const { headers } = previousContext;
            // return the headers to the context so httpLink can read them
         console.log(headers+'sdfsd');
         console.log('kjhg');
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : '',
                    TTd: gg
                }
            };
        });

        // Update the token from each response.
        const updateToken = data => {
            const context = operation.getContext();
            const { response } = context;
           // console.log(string.indexOf(substring) !== -1); // true
            
            if (response.headers.get('X-Cache') == 'HIT, HIT') { console.log('cache');
                this.token = null;
                this.gg = 'dff';
            }
            this.gg = response.headers.get('X-Cache');
            console.log(token);
            // Purposefully don't modify the result,
            // no other link needs to know about the cache id.
            return data;
        };

        return forward(operation).map(updateToken);
    }
}

export default function createAuthLink() {
    return new MagentoGQLCacheLink();
}