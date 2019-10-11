import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import { handleMessageEvent } from './handler';

setupWorkbox();

registerRoutes();

self.addEventListener('message', e => {
    const { type, payload } = e.data;
    handleMessageEvent(type, payload);
});
