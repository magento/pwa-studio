export const getSearchParams = location => {
    let inputText,
        categoryId = '';

    if (location.search) {
        const params = new URLSearchParams(location.search);
        inputText = params.get('query') || '';
        categoryId = params.get('category');
    }

    return { inputText, categoryId };
};
