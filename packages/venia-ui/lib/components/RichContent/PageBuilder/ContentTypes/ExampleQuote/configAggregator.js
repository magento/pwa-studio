import { getAdvanced, getCssClasses } from '../../utils';

export default node => {
    const props = {
        quote: node.children[0].textContent,
        author: node.children[1].textContent,
        description: node.children[2].textContent,
        ...getAdvanced(node),
        ...getCssClasses(node.children[0])
    };

    return props;
};
