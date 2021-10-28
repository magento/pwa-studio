export const toCamelCase = str => {
    return str.replace(/[-_ ]([a-zA-Z])/g, str => str.substr(1).toUpperCase());
};
