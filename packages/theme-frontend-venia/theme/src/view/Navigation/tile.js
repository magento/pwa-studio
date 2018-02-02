import { Component, createElement } from 'react';

import './tile.css';

class Tile extends Component {
    render() {
        const { text, href } = this.props;

        return (
            <a className="Navigation-tile" href={href}>
                <span className="Navigation-tile-image" />
                <span className="Navigation-tile-label">{text}</span>
            </a>
        );
    }
}

export default Tile;
