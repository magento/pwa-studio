import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import mockData from './mockData';
import defaultClasses from './category.css';

const emptyData = [];

class Category extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            gallery: PropTypes.string,
            root: PropTypes.string,
            title: PropTypes.string
        })
    };

    state = {
        loaded: false
    };

    componentDidMount() {
        this.timer = window.setTimeout(() => {
            this.setState(() => ({ loaded: true }));
        }, 1000);
    }

    componentWillUnmount() {
        window.clearTimeout(this.timer);
    }

    render() {
        const { classes } = this.props;
        const data = this.state.loaded ? mockData : emptyData;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <span>Dresses</span>
                </h1>
                <section className={classes.gallery}>
                    <Gallery data={data} title="Dresses" />
                </section>
            </article>
        );
    }
}

export default classify(defaultClasses)(Category);
