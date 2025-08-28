import DOMPurify from 'dompurify';
import { getAdvanced } from '../../utils';

export default node => {
    // Get the raw HTML content from the first child node
    const rawHTML = node.childNodes[0] ? node.childNodes[0].innerHTML : '';

    // Sanitize the raw HTML using DOMPurify
    const sanitizedHTML = DOMPurify.sanitize(rawHTML, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: [
            'allow',
            'allowfullscreen',
            'frameborder',
            'scrolling',
            'src',
            'title',
            'width',
            'height',
            'sandbox'
        ],
        ALLOWED_URI_REGEXP: /^https?:\/\//i // allow only http/https sources
    });

    return {
        // Return the sanitized HTML content, along with the result from getAdvanced
        richContent: sanitizedHTML,
        ...getAdvanced(node)
    };
};
