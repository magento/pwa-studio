import { getAdvanced } from '../../utils';

export default node => {
    return {
        text: node.innerText,
        headingType: node.nodeName,
        ...getAdvanced(node)
    };
};
