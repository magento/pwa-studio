import React, { Component } from 'react';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';

class CategoryContent extends Component {
    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.description : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                </h1>
                <section className={classes.gallery}>
                    <Gallery data={items} title={title} pageSize={pageSize} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
