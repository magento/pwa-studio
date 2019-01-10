import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import classify from 'src/classify';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import defaultClasses from './categoryList.css';
import CategoryTile from './categoryTile';
import categoryListQuery from '../../queries/getCategoryList.graphql';

class CategoryList extends Component {
    static propTypes = {
        id: number,
        title: string,
        classes: shape({
            root: string,
            header: string,
            content: string
        })
    };

    get header() {
        const { title, classes } = this.props;

        return title ? (
            <div className={classes.header}>
                <h2 className={classes.title}>
                    <span>{title}</span>
                </h2>
            </div>
        ) : null;
    }

    render() {
        const { id, classes } = this.props;

        return (
            <div className={classes.root}>
                {this.header}
                <Query query={categoryListQuery} variables={{ id }}>
                    {({ loading, error, data }) => {
                        if (error) {
                            return (
                                <div className={classes.fetchError}>
                                    Data Fetch Error: <pre>{error.message}</pre>
                                </div>
                            );
                        }
                        if (loading) {
                            return loadingIndicator;
                        }
                        if (data.category.children.length === 0) {
                            return (
                                <div className={classes.noResults}>
                                    No child categories found.
                                </div>
                            );
                        }

                        return (
                            <div className={classes.content}>
                                {data.category.children.map(item => (
                                    <CategoryTile
                                        item={item}
                                        key={item.url_key}
                                    />
                                ))}
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default classify(defaultClasses)(CategoryList);
