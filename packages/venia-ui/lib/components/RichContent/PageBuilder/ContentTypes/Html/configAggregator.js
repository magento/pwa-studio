import { getAdvanced } from '../../utils';

export default node => {
    const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + node.innerText,
        'text/html'
    );
    return {
        html: dom.body.innerHTML,
        ...getAdvanced(node)
    };
};
