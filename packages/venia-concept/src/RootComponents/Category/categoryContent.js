import React, { Component } from 'react';
import HtmlHead from 'src/components/HtmlHead';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';

class CategoryContent extends Component {
    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.name : null;
        const description = data ? data.category.description : null;

        return (
            <article className={classes.root}>
                <HtmlHead
                    title={data.category.name}
                    meta_title={data.category.meta_title}
                    meta_keywords={data.category.meta_keywords}
                    meta_description={data.category.meta_description}
                />
                <h1 className={classes.title}>{title}</h1>
                <section>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: description
                        }}
                    />
                </section>
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
