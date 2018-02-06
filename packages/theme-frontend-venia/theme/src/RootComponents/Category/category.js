import { Component, createElement } from 'react';

import Gallery from 'src/view/Gallery';
import mockData from './mockData';

import './category.css';

const emptyData = [];

class Category extends Component {
    state = {
        loaded: false
    };

    render() {
        const data = this.state.loaded ? mockData : emptyData;

        return (
            <article className="Category">
                <h1 className="Category-title">
                    <span>Dresses</span>
                </h1>
                <section className="Category-hero">
                    <div className="Category-hero-image" />
                </section>
                <button onClick={this.handleClickUnload}>Set state to 0</button>
                <button onClick={this.handleClickLoad}>Set state to 1</button>
                <section className="Category-gallery">
                    <Gallery data={data} />
                </section>
            </article>
        );
    }

    handleClickLoad = () => {
        this.setState(() => ({ loaded: true }));
    };

    handleClickUnload = () => {
        this.setState(() => ({ loaded: false }));
    };
}

export default Category;
