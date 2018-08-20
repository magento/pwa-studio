import { Component, createElement } from 'react';
import { arrayOf, shape, string, func } from 'prop-types';

class Selector extends Component {
    static propTypes = {
        options: arrayOf(
            shape({
                code: string,
                title: string
            })
        ),
        handleSelection: func
    };

    render() {
        const { options, handleSelection } = this.props;
        return (
            <ul>
                {
                    options.map(( props ) => {
                        return (
                            <li
                                value={props.code}
                                onClick={ev => handleSelection(props.code) }
                                key={props.code}
                            >
                                { props.title }
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

}

export default Selector;
