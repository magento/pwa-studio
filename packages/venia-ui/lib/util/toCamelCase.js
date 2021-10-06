export const toCamelCase = str => {
    return str.replace(/-([a-z])/g, str => str.substr(1).toUpperCase());
};
