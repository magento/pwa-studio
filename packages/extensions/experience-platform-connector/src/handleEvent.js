import handlers from './config';

export default (sdk, event) => {
    handlers.forEach(({ canHandle, handle }) => {
        if (canHandle(event)) {
            handle(sdk, event);
        }
    });
};
