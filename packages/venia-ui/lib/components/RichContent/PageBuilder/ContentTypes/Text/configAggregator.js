import { getAdvanced } from '../../utils';

export default node => {
    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    };
};
