import { Component } from 'react';
import { func, string } from 'prop-types';

export default class ContainerChild extends Component {
    static propTypes = {
        id: string.isRequired,
        render: func.isRequired
    };

    render() {
        return this.props.render();
    }
}
