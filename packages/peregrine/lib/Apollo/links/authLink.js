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
            // console.log(token);
           
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

            
            if (response.headers.get('Pragma') == 'cache') { console.log('cache');
                token = null;
                gg = 'dff';
            }
            gg = response.headers.get('Pragma');
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