import React from 'react';
import { mergeClasses } from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';

const CategoryContent = props => {
    const { pageControl, data, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const items = data ? data.category.products.items : null;
    const title = data ? data.category.description : null;
    const categoryTitle = data ? data.category.name : null;

    return (
        <article className={classes.root}>
            <h1 className={classes.title}>
                {/* TODO: Switch to RichContent component from Peregrine when merged */}
                <div
                    dangerouslySetInnerHTML={{
                        __html: title
                    }}
                />
                <div className={classes.categoryTitle}>{categoryTitle}</div>
            </h1>
            <section className={classes.gallery}>
                <Gallery data={items} title={title} pageSize={pageSize} />
            </section>
            <div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
        </article>
    );
};

export default CategoryContent;
