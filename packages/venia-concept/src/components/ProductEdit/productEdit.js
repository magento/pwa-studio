import React, { Component} from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';
import ProductOptions from 'src/components/ProductOptions';
import OptionsHeader from 'src/components/ProductOptions/optionsHeader';
import { tileItems, miniTiles, swatchItems } from 'src/components/ProductOptions/mock_data';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import swatchClasses from 'src/components/ProductOptions/swatch.css';
/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
const configurableItemQuery = gql`
    query products($sku: String) {
        products(
            pageSize: 10
            currentPage: 0
            filter: {
                sku: {
                    eq: $sku
                }
            }
            sort: {}
        ) {
            items {
                sku
                name
                    ... on ConfigurableProduct {
                        configurable_options {
                            label
                            values{
                                store_label
                                value_index
                            }
                        }
                        variants {
                            product {
                                sku
                                id
                                swatch_image
                                size
                                color
                            }
                        }
                    }
            }
        }
    }
`;


class ProductEdit extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            colors: PropTypes.string,
            header: PropTypes.string
        }),
        item: PropTypes.object
    };

    mapData = (data) => {
        return data.map((item) => {
            const options = item.values.map((value) => {
                return {
                    item: {
                        backgroundColor: value.store_label,
                        name: value.store_label,
                        onclick:() => console.log('swatch')
                    },
                    classes: swatchClasses
                }
            })
            return {
                label: item.label,
                items: options
            }
        });
    }

    render() {
        const { classes, item } = this.props;
        return (
            <Query
                query={configurableItemQuery}
                variables={{sku: item.sku}}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;
                    const mappedData = this.mapData(data.products.items[0].configurable_options);
                    console.log(mappedData);
                    const optionsList = data.products.items[0].configurable_options;
                    console.log(data);
                    return (
                        <div className={classes.root}>
                            <div className={classes.header}>{item.name}</div>
                            <div className={classes.colors}>
                                {mappedData.map( (option, index) => {
                                    return (
                                        <OptionsHeader
                                            key={index}
                                            title={option.label}
                                            helpText={'Size Guide'}
                                            helpClick={() => { window.alert('hello')}}
                                        >
                                            <ProductOptions options={option.items}/>
                                        </OptionsHeader>
                                    )
                                })}
                        </div>
                        </div>
                    )}
                }
            </Query>
        );
    }
}

export default classify(defaultClasses)(ProductEdit);
