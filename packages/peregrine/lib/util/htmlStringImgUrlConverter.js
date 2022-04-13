import makeUrl from './makeUrl';

/**
 * Modifies html string images to use makeUrl as source.
 *
 * @param {string} htmlString - the html string to be updated
 * @return {string}
 */
const htmlStringImgUrlConverter = htmlString => {
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = htmlString;
    for (const imgElement of temporaryElement.getElementsByTagName('img')) {
        imgElement.src = makeUrl(imgElement.src, {
            type: 'image-wysiwyg',
            quality: 85
        });
    }
    return temporaryElement.innerHTML;
};

export default htmlStringImgUrlConverter;
