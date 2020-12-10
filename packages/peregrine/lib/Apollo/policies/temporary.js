/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */
const temporaryTypePolicies = {
    StoreConfig: {
        fields: {
            configurable_thumbnail_source: {
                read() {
                    return (
                        process.env.CONFIGURABLE_THUMBNAIL_SOURCE
                    );
                }
            }
        }
    },
    ConfigurableCartItem: {
        fields: {
            configured_variant: {
                read(_, { readField, toReference }) {
                    const product = readField('product');

                    if (process.env.CONFIGURABLE_THUMBNAIL_SOURCE === 'parent') {
                        return product
                    }

                    const optionUids = readField('configurable_options')
                        .map(option => {
                            const optionObject = JSON.parse(option.__ref.substring(option.__ref.indexOf('{'), option.__ref.lastIndexOf('}') + 1))
                            const string = `configurable/${optionObject.id}/${optionObject.value_id}`;
                            return new Buffer(string).toString('base64');
                        })
                        .sort()
                        .toString();

                    const variant = readField('variants', product)
                        .map(variant => {
                            const variantUids = variant.attributes
                                .map(attribute => attribute.uid)
                                .sort()
                                .toString();
                            return variantUids === optionUids && variant.product;
                        })
                        .filter(Boolean)[0];

                    return (variant);
                }
            }
        }
    }
};

export default temporaryTypePolicies;
