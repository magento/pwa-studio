import makeUrl from './makeUrl';
import resolveLinkProps from './resolveLinkProps';

/**
 * Modifies html string images to use makeUrl as source and resolves links to use internal path.
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
    for (const linkElement of temporaryElement.getElementsByTagName('a')) {
        const linkProps = resolveLinkProps(linkElement.href);
        linkElement.href = linkProps.to || linkProps.href;
    }
    return temporaryElement.innerHTML;
};

export default htmlStringImgUrlConverter;
