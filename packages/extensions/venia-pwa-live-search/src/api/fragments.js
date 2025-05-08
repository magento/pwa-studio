/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const Facet = `
    fragment Facet on Aggregation {
        title
        attribute
        buckets {
            title
            __typename
            ... on CategoryView {
                name
                count
                path
            }
            ... on ScalarBucket {
                count
            }
            ... on RangeBucket {
                from
                to
                count
            }
            ... on StatsBucket {
                min
                max
            }
        }
    }
`;

const ProductView = `
    fragment ProductView on ProductSearchItem {
        productView {
            __typename
            sku
            name
            inStock
            url
            urlKey
            images {
                label
                url
                roles
            }
            ... on ComplexProductView {
                priceRange {
                    maximum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                    minimum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                }
                options {
                    id
                    title
                    values {
                        title
                        ... on ProductViewOptionValueSwatch {
                            id
                            inStock
                            type
                            value
                        }
                    }
                }
            }
            ... on SimpleProductView {
                price {
                    final {
                        amount {
                            value
                            currency
                        }
                    }
                    regular {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
        }
        highlights {
            attribute
            value
            matched_words
        }
    }
`;

const Product = `
    fragment Product on ProductSearchItem {
        product {
            __typename
            sku
            description {
                html
            }
            short_description {
                html
            }
            name
            canonical_url
            small_image {
                url
            }
            image {
                url
            }
            thumbnail {
                url
            }
            price_range {
                minimum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
                maximum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
            }
        }
    }
`;

export { Facet, ProductView, Product };
