export default node => {
    const text = node.getElementsByClassName('lms-option');
    const bannerType = text[0].innerText;
    const categoryId = bannerType === 'category' ? text[1].innerText : null;

    return {
        bannerType,
        categoryId
    };
};
