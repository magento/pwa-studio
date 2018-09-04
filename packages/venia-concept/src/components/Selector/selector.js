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
        classes: shape({
            root: string
        }),
        selectedOption: string,
        handleSelection: func
    };

    render() {
        const { options, handleSelection, classes, selectedOption } = this.props;

        return (
            <ul className={classes.root}>
                {
                    options.map(( props ) => {
                      
                        return (
                            <Section
                                value={props.code}
                                onClick={ev => handleSelection(props) }
                                key={props.code}
                                label={"Select"}
                                selectedOption={selectedOption === props.title}
                            >
                                { props.title }
                            </Section>
                        )
                    })
                }
            </ul>
        )
    }

}

export default classify(defaultClasses)(Selector);
