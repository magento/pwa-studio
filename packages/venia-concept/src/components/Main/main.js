import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import defaultClasses from './main.css';

class Main extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            root_masked: PropTypes.string
        }),
        isMasked: PropTypes.bool
    };

    render() {
        const { children, classes, isMasked } = this.props;
        const className = isMasked ? classes.root_masked : classes.root;

        return (
            <main className={className}>
                <Header />
                {children}
                <Footer />
            </main>
        );
    }
}

export default classify(defaultClasses)(Main);
