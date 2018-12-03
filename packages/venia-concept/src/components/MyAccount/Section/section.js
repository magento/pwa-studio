import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defatulClasses from './section.css';

class Section extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            title: PropTypes.string
        }),
        title: PropTypes.node,
        rightTitle: PropTypes.node,
        children: PropTypes.node
    };

    render() {
        const { title, rightTitle, children, classes } = this.props;

        return (
            <section className={classes.root}>
                <div className={classes.header}>
                    <h2 className={classes.title}>{title}</h2>
                    {rightTitle}
                </div>
                {children}
            </section>
        );
    }
}

export default classify(defatulClasses)(Section);
