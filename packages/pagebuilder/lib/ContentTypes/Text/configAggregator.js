import { getAdvanced } from '../../utils';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

export default node => {
    if (process.env.USE_STORE_CODE_IN_URL === 'true') {
        const storeViewCode =
            storage.getItem('store_view_code') || STORE_VIEW_CODE;

        // For each link update the href to include the active store code.
        node.querySelectorAll('a').forEach(oldNode => {
            const newNode = oldNode.cloneNode(true);
            newNode.href = `/${storeViewCode}${oldNode.getAttribute('href')}`;
            oldNode.parentNode.replaceChild(newNode, oldNode);
        });
    }

    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    };
};
