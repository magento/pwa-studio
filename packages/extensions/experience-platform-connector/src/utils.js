/** Cart focused utils **/

/**
 * Returns the total sum from an array of cart products
 *
 * @param {Array} products
 * @returns {Number} Sum of all product prices in the array
 */
export const getCartTotal = products => {
    return products
        ? products.reduce(
              (previous, current) =>
                  current.prices.price.value * current.quantity + previous,
              0
          )
        : 0;
};

/**
 * Get the currency from the first product item in an array of cart products
 *
 * @param {Array} products
 * @returns {String} Currency code from the first product item or null if array is empty
 */
export const getCurrency = products =>
    products && products.length > 0 ? products[0].prices.price.currency : null;

/**
 * Transforms an array of cart products into a format compatible with the
 * Magento Storefront Event SDK
 *
 * @param {Array} products
 * @returns {Array} Array of data compatible with the Magento Storefront Event SDK
 */
export const getFormattedProducts = products => {
    return products
        ? products.map(item => {
              const {
                  uid,
                  product,
                  prices,
                  quantity,
                  configurable_options: options
              } = item;

              const {
                  name,
                  sku,
                  __typename: type,
                  url_key: url,
                  small_image: image,
                  thumbnail
              } = product;

              const formattedOptions = options
                  ? options.map(option => {
                        const {
                            id,
                            option_label,
                            value_label,
                            configurable_product_option_value_uid: valueId
                        } = option;
                        return {
                            id: id,
                            optionLabel: option_label,
                            valueId: valueId,
                            valueLabel: value_label
                        };
                    })
                  : null;

              const imageUrl = image
                  ? image.url
                  : thumbnail
                  ? thumbnail.url
                  : null;

              return {
                  formattedPrice: '',
                  id: uid,
                  prices: prices,
                  product: {
                      name: name,
                      sku: sku,
                      productType: type,
                      pricing: {
                          regularPrice: prices.price.value,
                          minimalPrice: prices.price.value,
                          maximalPrice: prices.price.value,
                          currencyCode: prices.price.currency
                      },
                      canonicalUrl: url,
                      mainImageUrl: imageUrl
                  },

                  configurableOptions: formattedOptions,
                  quantity: quantity
              };
          })
        : null;
};
