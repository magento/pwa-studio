/* eslint-disable */
import { Component, createElement } from 'react';

import Tile from './tile';
import Trigger from './trigger';

import './navigation.css';

const CATEGORIES = [
    'dresses',
    'tops',
    'bottoms',
    'skirts',
    'swim',
    'outerwear',
    'shoes',
    'jewelry',
    'accessories'
];

const tiles = CATEGORIES.map(category => (
    <Tile key={category} text={category} />
));

class Navigation extends Component {
    render() {
        const { nav } = this.props;

        return (
            <aside className="Navigation" data-nav={nav}>
                <div className="Navigation-header">
                    <h2 className="Navigation-header-title">
                        <span>Main Menu</span>
                    </h2>
                    <Trigger className="Navigation-navTrigger" nav={nav}>
                        <span>❌</span>
                    </Trigger>
                </div>
                <nav className="Navigation-tiles">{tiles}</nav>
                <ul className="Navigation-items">
                    <li className="Navigation-item">
                        <a className="Navigation-item-link">
                            <span>👩</span>
                        </a>
                    </li>
                    <li className="Navigation-item">
                        <a className="Navigation-item-link">
                            <span>💖</span>
                        </a>
                    </li>
                    <li className="Navigation-item">
                        <a className="Navigation-item-link">
                            <span>📞</span>
                        </a>
                    </li>
                    <li className="Navigation-item">
                        <a className="Navigation-item-link">
                            <span>🤔</span>
                        </a>
                    </li>
                </ul>
            </aside>
        );
    }
}

export default Navigation;
