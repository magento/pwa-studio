import { ElementFinder } from 'protractor';

import { element, elements } from '../utils';
import { Component } from './abstract.component';

export class HeaderItemComponent extends Component {
    public root: ElementFinder = super.root;
    @element('.top-navigation__item-link') public readonly info!: ElementFinder;
    @element('.top-navigation__flyout-list') public readonly subMenu!: ElementFinder;
}
