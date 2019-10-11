import { getAdvanced, getCssClasses, getBackgroundImages } from '../../utils';

export default (node, props) => {
    console.log(node);

    const propObject = {
        quote: node.childNodes[0].textContent,
        author: node.childNodes[1].textContent,
        description: node.childNodes[2].innerHTML,
        ...getAdvanced(node)
    };

    console.log(propObject);

    return propObject;
};
