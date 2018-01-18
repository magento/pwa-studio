import { Component, createElement } from 'react';

import './main.css';

class Main extends Component {
    render() {
        const { children } = this.props;

        return <main className="Main">{children}</main>;
    }
}

export default Main;
