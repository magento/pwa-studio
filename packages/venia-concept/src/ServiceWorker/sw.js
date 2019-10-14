import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import {
    handleMessageFromClient,
    registerMessagePort
} from './Utilities/messageHandler';

import { UPDATE_CLIENT_TO_SW_MESSAGE_PORT } from '@magento/venia-ui/lib/constants/messageTypes';

setupWorkbox();

registerRoutes();

self.addEventListener('message', e => {
    const { type, payload } = e.data;
    if (type === UPDATE_CLIENT_TO_SW_MESSAGE_PORT) {
        /**
         * This message needs to be handled differently
         * because the port needs to be transfered. Port
         * transfer can not be done as part of payload like
         * other messages. It needs to be sent as event.ports.
         */
        registerMessagePort(e.ports[0]);
    } else {
        handleMessageFromClient(type, payload);
    }
});
