export const processDate = date => {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long'
    });
};
