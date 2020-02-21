import { getAdvanced } from '../../utils';

export default node => {
    return {
        richContent: node.childNodes[0] ? node.childNodes[0].innerHTML : '',
        ...getAdvanced(node)
    };
};
