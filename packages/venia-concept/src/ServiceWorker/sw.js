import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import { handleMessageFromClient } from './Utilities/messageHandler';

import { UPDATE_CLIENT_TO_SW_MESSAGE_PORT } from '@magento/venia-ui/lib/constants/messageTypes';

setupWorkbox();

registerRoutes();

self.addEventListener('message', e => {
    const { type, payload } = e.data;

    handleMessageFromClient(type, payload, e);
});
