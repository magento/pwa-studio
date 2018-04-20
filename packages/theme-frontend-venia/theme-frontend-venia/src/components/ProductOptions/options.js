import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Option from './option';

class Options extends Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        const { options } = this.props;

        return options.map(option => <Option key={option.id} {...option} />);
    }
}

export default Options;
