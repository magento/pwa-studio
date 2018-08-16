import { Component, createElement } from 'react';
import defaultClasses from './loader.css';
import classify from 'src/classify';
import { string, shape } from 'prop-types';
import logo from 'src/shared/logo.svg';

class Loader extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            loaderAnimation: string
        })
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <img
                    className={classes.loaderAnimation}
                    alt="logo"
                    src={logo}
                    height="128"
                />
                <p className={classes.loaderAnimation}>loading...</p>
            </div>
        );
    }
}

export default classify(defaultClasses)(Loader);
