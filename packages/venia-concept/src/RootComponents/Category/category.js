import React, { Component } from 'react';
import { number, shape, string } from 'prop-types';
import { Query } from 'react-apollo';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Page from 'src/components/Page';
import defaultClasses from './category.css';
import categoryQuery from '../../queries/getCategory.graphql';

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        })
    };

    render() {
        const { id, classes } = this.props;

        return (
            <Page>
                <Query
                    query={categoryQuery}
                    variables={{ id, onServer: false }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        const { category } = data;
                        const description =
                            category.description || category.name;
                        return (
                            <article className={classes.root}>
                                <h1 className={classes.title}>
                                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: description
                                        }}
                                    />
                                </h1>
                                <section className={classes.gallery}>
                                    <Gallery
                                        data={category.products.items}
                                        title={description}
                                    />
                                </section>
                            </article>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

export default classify(defaultClasses)(Category);
