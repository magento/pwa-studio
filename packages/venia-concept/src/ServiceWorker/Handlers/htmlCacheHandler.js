import { registerHandler } from '../handler';

registerHandler('HAS_INDEX_HTML', payload => {
    console.log(payload);
});
