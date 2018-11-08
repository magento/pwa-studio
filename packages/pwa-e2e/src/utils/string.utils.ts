const extractSingleNumber = (text: string) => {
    const matched = text.match(/\d/g);
    if (matched) {
        return +matched.join('');
    }
};

export const StringUtils = {
    extractSingleNumber,
};
