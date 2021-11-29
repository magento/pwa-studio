import { getAdvanced } from '../../utils';

export default node => {
    return {
        displayMode: node.childNodes[0].getAttribute('data-display-mode'),
        uids: node.childNodes[0].getAttribute('data-uids'),
        ...getAdvanced(node)
    };
};
