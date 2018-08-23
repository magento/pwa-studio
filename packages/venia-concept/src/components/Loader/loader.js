import { Component, createElement } from 'react';
import defaultClasses from './loader.css';
import classify from 'src/classify';
import { string, shape, number } from 'prop-types';
import logo from 'src/shared/logo.svg';

class Loader extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            loaderAnimation: string
        }),
        height: number,
        text: string,
        networkState: string
    };

    static defaultProps = {
        height: 128,
        text: 'Loading...'
    };

    render() {
        const { classes, height, text } = this.props;
        return (
            <div className={classes.root}>
                <img
                    className={classes.loaderAnimation}
                    alt="logo"
                    src={logo}
                    height={height}
                />
                <p className={classes.loaderAnimation}>{text}</p>
            </div>
        );
    }
}

export default classify(defaultClasses)(Loader);
