import { getAdvanced } from '../../utils';

export default node => {
    return {
        text: node.textContent,
        headingType: node.nodeName.toLowerCase(),
        ...getAdvanced(node)
    };
};
