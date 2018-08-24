import { Component, createElement } from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import Section from '../Checkout/section'
import classify from 'src/classify'
import defaultClasses from './selector.css'

class Selector extends Component {
    static propTypes = {
        options: arrayOf(
            shape({
                code: string,
                title: string,
                carrier_title: string,
            })
        ),
        selectedOption: string,
        handleSelection: func
    };

    render() {
        const { options, handleSelection, classes, selectedOption } = this.props;

        return (
            <ul className={classes.root}>
                {
                    options.map(( props ) => {
                      const listValue = (props.carrier_title) ? props.carrier_title : props.code;
                      const listTitle = (props.carrier_title) ? props.carrier_title : props.title;
                        return (
                            <Section
                                value={listValue}
                                onClick={ev => handleSelection(props) }
                                key={listValue}
                                label={"Select"}
                                selectedOption={selectedOption === listTitle}
                            >
                                { listTitle }
                            </Section>
                        )
                    })
                }
            </ul>
        )
    }

}

export default classify(defaultClasses)(Selector);
