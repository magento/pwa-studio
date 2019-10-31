import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import { handleMessageFromClient } from './Utilities/messageHandler';

setupWorkbox();

registerRoutes();

self.addEventListener('message', e => {
    const { type, payload } = e.data;

    handleMessageFromClient(type, payload, e);
});
