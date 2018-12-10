import React, { Component } from 'react';
import { bool, shape, string } from 'prop-types';

import classify from 'src/classify';
import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import defaultClasses from './page.css';

class Page extends Component {
    static propTypes = {
        classes: shape({
            page: string,
            page_masked: string,
            root: string,
            root_masked: string
        }),
        isMasked: bool
    };

    get classes() {
        const { classes, isMasked } = this.props;
        const suffix = isMasked ? '_masked' : '';

        return ['main', 'root'].reduce(
            (acc, val) => ({ ...acc, [val]: classes[`${val}${suffix}`] }),
            {}
        );
    }

    render() {
        const { classes, props } = this;
        const { children } = props;

        return (
            <div className={classes.root}>
                <Header />
                <main className={classes.main}>{children}</main>
                <Footer />
            </div>
        );
    }
}

export default classify(defaultClasses)(Page);
