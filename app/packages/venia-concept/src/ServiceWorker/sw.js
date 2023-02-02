import { handleMessageFromClient } from './Utilities/messageHandler';
import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import registerMessageHandlers from './registerMessageHandlers';

setupWorkbox();

registerRoutes();

registerMessageHandlers();

self.addEventListener('message', e => {
    const { type, payload } = e.data;

    handleMessageFromClient(type, payload, e);
});
