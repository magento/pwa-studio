import { getAdvanced, getCssClasses } from '../../utils';

export default node => {
    const props = {
        display: node.style.display,
        text: node.textContent,
        textAlign: node.style.textAlign,
        openInNewTab: node.childNodes[0].getAttribute('target') === '_blank',
        ...getAdvanced(node.childNodes[0]),
        ...getCssClasses(node)
    };

    let buttonType;

    if (node.childNodes[0].classList.contains('pagebuilder-button-secondary')) {
        buttonType = 'secondary';
    } else if (
        node.childNodes[0].classList.contains('pagebuilder-button-link')
    ) {
        buttonType = 'link';
    } else {
        buttonType = 'primary';
    }

    props.buttonType = buttonType;

    if (node.childNodes[0].nodeName === 'A') {
        props.link = node.childNodes[0].getAttribute('href');
        props.linkType = node.childNodes[0].getAttribute('data-link-type');
    }

    return props;
};
