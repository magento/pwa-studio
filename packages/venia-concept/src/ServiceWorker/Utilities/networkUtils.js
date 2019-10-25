export const isFastNetwork = () =>
    navigator.connection && navigator.connection.effectiveType === '4g';
