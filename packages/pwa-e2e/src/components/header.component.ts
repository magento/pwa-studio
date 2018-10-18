import { browser, ElementArrayFinder } from 'protractor';
import { elements } from '../utils/protractor';
import { Component } from './abstract.component';

export class HeaderComponent extends Component {
    @elements('.top-navigation__row .top-navigation__item')
    public readonly items!: ElementArrayFinder;
}