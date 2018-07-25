import { Component, createElement } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import defaultClasses from './categoryList.css';

// TODO: get only active categories from graphql when it is ready
const categoryListQuery = gql`
    query category($id: Int!) {
        category(id: $id) {
            children {
              name
              url_key
              url_path
              image
            }
        }
    }
`;

// TODO: get baseUrl from graphql when it is ready
const baseUrl = 'https://magento-venia.local.pwadev:8000';

// TODO: get mediaUrl from graphql when it is ready
const mediaUrl = 'https://magento-venia.local.pwadev:8000/pub/media';

// TODO: get categoryUrlSuffix from graphql when it is ready
const categoryUrlSuffix = '.html';

class CategoryList extends Component {
    static propTypes = {
        id: number,
        title: string,
        classes: shape({
            root: string,
            header: string,
            content: string,
            title: string,
            item: string,
            imageWrapper: string,
            image: string,
            name: string
        })
    };

    static defaultProps = {
        id: 2
    };

    render() {
        let { data } = this.props;
        const { id, classes } = this.props;

        return (
            <div className={classes.root}>
                {this.props.title &&
                    <div className={classes.header}>
                        <h2 className={classes.title}>
                            <span>{this.props.title}</span>
                        </h2>
                    </div>
                }
                <Query query={categoryListQuery} variables={{id}}>
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        if (data.category.children == '') return <div>Here are not any child categories</div>;

                        return (
                            <div className={classes.content}>
                                {data.category.children.map((item, index) => (
                                    <a
                                        className={classes.item}
                                        href={`${baseUrl}/${item.url_key}${categoryUrlSuffix}`}
                                        key={item.name}
                                    >
                                        <span className={classes.imageWrapper}>
                                            {item.image &&
                                                <img
                                                className={classes.image}
                                                src={`${mediaUrl}/catalog/category/${item.image}`}
                                                alt={item.name} />
                                            }
                                        </span>
                                        <span className={classes.name}>
                                            {item.name}
                                        </span>
                                    </a>
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
