export const processDate = (timestamp = Date.now()) => {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long'
    });
};
