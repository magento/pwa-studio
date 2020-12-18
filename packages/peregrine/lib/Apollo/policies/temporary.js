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
            // This field is available in Magento 2.4.2 we need to support older versions, so env var is used here
            configurable_thumbnail_source: {
                read() {
                    return process.env.CONFIGURABLE_THUMBNAIL_SOURCE;
                }
            }
        }
    },
    ConfigurableCartItem: {
        fields: {
            // This field is proposed in the https://github.com/magento/magento2/pull/30817
            configured_variant: {
                read(_, { readField, toReference }) {
                    const product = readField('product');
                    const optionUids = readField('configurable_options')
                        .map(option => {
                            const id = readField(
                                'id',
                                toReference(option.__ref)
                            );
                            const value_id = readField(
                                'value_id',
                                toReference(option.__ref)
                            );
                            return new Buffer(
                                `configurable/${id}/${value_id}`
                            ).toString('base64');
                        })
                        .sort()
                        .toString();

                    return readField('variants', product)
                        .map(variant => {
                            const variantUids = variant.attributes
                                .map(attribute => attribute.uid)
                                .sort()
                                .toString();
                            return (
                                variantUids === optionUids && variant.product
                            );
                        })
                        .filter(Boolean)[0];
                }
            }
        }
    }
};

export default temporaryTypePolicies;
