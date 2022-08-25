import { getAdvanced } from '../../utils';

export default node => {
    return {
        width: node.childNodes[0].style.width,
        color: node.childNodes[0].style.borderColor,
        thickness: node.childNodes[0].style.borderWidth,
        ...getAdvanced(node)
    };
};
