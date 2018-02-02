/* eslint-disable */
import { Component, createElement } from 'react';
import { Link } from 'react-router-dom';

import { Trigger } from 'src/view/Navigation';

import './header.css';

class Header extends Component {
    render() {
        const { nav } = this.props;

        return (
            <header className="Header" data-nav={nav}>
                <div className="Header-toolbar">
                    <h2 className="Header-title">
                        <span>Rush</span>
                    </h2>
                    <div className="Header-primaryActions">
                        <Trigger className="Header-navTrigger" nav={nav}>
                            <span>🍔</span>
                        </Trigger>
                    </div>
                    <div className="Header-secondaryActions">
                        <div className="Header-cartTrigger">
                            <Link to="/cart">🛒</Link>
                        </div>
                    </div>
                    <div className="Header-searchBlock">
                        <input
                            className="Header-searchBlock-input"
                            type="text"
                            placeholder="I'm looking for..."
                        />
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
