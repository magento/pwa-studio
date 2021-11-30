import { getAdvanced } from '../../utils';

export default node => ({
    displayInline: node.childNodes[0]
        .getAttribute('class')
        .includes('block-banners-inline'),
    displayMode: node.childNodes[0].getAttribute('data-display-mode'),
    uids: node.childNodes[0].getAttribute('data-uids'),
    ...getAdvanced(node)
});
