import { getAdvanced } from '../../utils';

export default node => {
    let html;
    if (node.dataset.decoded) {
        html = node.innerHTML;
        if (process.env.NODE_ENV !== 'production') {
            console.warn(
                'PageBuilder HTML content was unescaped! This may be a Magento configuration error.'
            );
        }
    } else {
        const dom = new DOMParser().parseFromString(
            '<!doctype html><body>' + node.textContent,
            'text/html'
        );
        html = dom.body.innerHTML;
    }
    return {
        html,
        ...getAdvanced(node)
    };
};
