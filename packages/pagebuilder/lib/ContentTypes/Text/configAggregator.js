import { getAdvanced, injectStoreCodeHref } from '../../utils';

export default node => {
    node = injectStoreCodeHref(node);

    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    };
};
