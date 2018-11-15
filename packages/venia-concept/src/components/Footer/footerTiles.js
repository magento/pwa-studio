import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Feather from 'feather-icons';

import { iconNameAttribute } from './constants';

const iconAttrs = {
    width: 18,
    color: 'black'
};

export default class FooterTiles extends Component {
    static propTypes = {
        content: PropTypes.string.isRequired
    };

    pairWithIconNames = iconsPlaceholders => {
        return Array.prototype.slice.call(iconsPlaceholders).map(node => {
            return { node, iconName: node.getAttribute(iconNameAttribute) };
        });
    };

    getIconMarkup = iconName => {
        const iconNode = document.createElement('span');
        const svg = Feather.icons[iconName].toSvg(iconAttrs);
        iconNode.innerHTML = svg;
        return iconNode;
    };

    replaceIconPlaceholder = item =>
        item.node.parentNode.replaceChild(
            this.getIconMarkup(item.iconName),
            item.node
        );

    interpolateIcons = htmlInString => {
        const htmlObject = document.createElement('div');
        htmlObject.innerHTML = htmlInString;

        let iconsPlaceholders = htmlObject.querySelectorAll(
            `[${iconNameAttribute}]`
        );
        if (!iconsPlaceholders) {
            return htmlInString;
        } else {
            iconsPlaceholders = this.pairWithIconNames(iconsPlaceholders);
            iconsPlaceholders.forEach(this.replaceIconPlaceholder);
            return htmlObject.innerHTML;
        }
    };

    render() {
        const { content: __html } = this.props;
        const interpolatedContent = this.interpolateIcons(__html);

        return (
            <div dangerouslySetInnerHTML={{ __html: interpolatedContent }} />
        );
    }
}
