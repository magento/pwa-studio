import { tapableHooks } from '@magento/peregrine';

/**
 * Instead of importing like this, there will be an enumerating
 * function that will give use the list of all extensions to import
 * and call. I have imported it here for the simplicity of the POC.
 */
import signoutExtension from './signoutExtension';

export default function() {
    signoutExtension(tapableHooks);
}
