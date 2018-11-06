import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import defaultClasses from './category.css';

const categoryQuery = gql`
    query category($id: Int!) {
        category(id: $id) {
            description
            name
            product_count
            products {
                items {
                    id
                    name
                    small_image
                    url_key
                    price {
                        regularPrice {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                    url_key
                }
            }
        }
    }
`;

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        })
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    render() {
        const { id, classes } = this.props;

        return (
            <Query query={categoryQuery} variables={{ id }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;

                    return (
                        <article className={classes.root}>
                            <h1 className={classes.title}>
                                {/* TODO: Switch to RichContent component from Peregrine when merged */}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: data.category.description
                                    }}
                                />
                            </h1>
                            <section className={classes.gallery}>
                                <Gallery
                                    data={data.category.products.items}
                                    title={data.category.description}
                                />
                            </section>
                        </article>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(Category);
