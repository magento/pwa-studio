import { getAdvanced } from '../../utils';

export default node => {
    return {
        isSameWidth: node.getAttribute('data-same-width') === 'true',
        ...getAdvanced(node)
    };
};
