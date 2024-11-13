export const generateShopperContext = overrides => ({
  shopperId: 'test123',
  ...overrides,
});

export const generateStorefrontInstanceContext = overrides => ({
  environtmentId: '1234',
  instanceId: 'instance1',
  environment: 'test',
  storeUrl: 'http://test.com',
  websiteId: 'main website',
  websiteCode: 'main website',
  storeId: 1234,
  storeCode: 'main store',
  storeViewId: 12345,
  storeViewCode: 'main store view code',
  websiteName: 'my website',
  storeName: 'my store name',
  storeViewName: 'my store view name',
  baseCurrencyCode: 'usd',
  storeViewCurrencyCode: 'usd',
  catalogExtensionVersion: '1.2.3',
  ...overrides,
});

export const generateMagentoExtensionContext = overrides => ({
  magentoExtensionVersion: '1.2.3',
  ...overrides,
});

export const generateProductContext = overrides => ({
  id: 1144,
  categories: [
    {
      id: 12,
      breadcrumbs: [
        {
          categoryId: 11,
        },
      ],
    },
  ],
  description:
    '<p>The Selena Pants are one of the more form-fitting pieces in the Venia collection. But don\'t be fooled by their appearance. These gems are made with soft pima cotton and just the right amount of stretch.</p><p>Features:</p><ul><li>Cotton waistband</li><li>Drawstring waist</li><li>Sits just below waist</li><li>31" inseam</li><li>Machine wash, line dry</li></ul>',
  mediaGalleryEntries: [
    {
      id: 1238,
      label: 'Main',
      position: 1,
      disabled: false,
      file: '/v/p/vp01-ll_main_4.jpg',
    },
  ],
  metaDescription:
    "The Selena Pants are one of the more form-fitting pieces in the Venia collection. But don't be fooled by their appearance. These gems are made with soft pima cotton and just the right amount of stretch. Features: Cotton waistband. Drawstring waist. Sits ",
  name: 'Selena Pants',
  price: {
    regularPrice: {
      amount: {
        currency: 'USD',
        value: 108,
      },
    },
  },
  sku: 'VP01-LL-XL',
  parentSku: 'VP01',
  smallImage:
    'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
  urlKey: 'selena-pants',
  configurableOptions: [
    {
      attributeCode: 'fashion_color',
      attributeId: '180',
      id: 96,
      label: 'Fashion Color',
      values: [
        {
          defaultLabel: 'Lilac',
          label: 'Lilac',
          storeLabel: 'Lilac',
          useDefaultValue: true,
          valueIndex: 23,
          swatchData: {
            value: '#dcd5e1',
          },
        },
      ],
    },
    {
      attributeCode: 'fashion_size',
      attributeId: '183',
      id: 97,
      label: 'Fashion Size',
      values: [
        {
          defaultLabel: 'L',
          label: 'L',
          storeLabel: 'L',
          useDefaultValue: true,
          valueIndex: 29,
          swatchData: {
            value: 'L',
          },
        },
      ],
    },
  ],
  variants: [
    {
      attributes: [
        {
          code: 'fashion_color',
          valueIndex: 27,
        },
        {
          code: 'fashion_size',
          valueIndex: 31,
        },
      ],
      product: {
        id: 794,
        mediaGalleryEntries: [
          {
            id: 804,
            disabled: false,
            file: '/v/p/vp01-la_main_2.jpg',
            label: 'Main',
            position: 1,
          },
        ],
        sku: 'VP01-LA-S',
        stockStatus: 'IN_STOCK',
        price: {
          regularPrice: {
            amount: {
              currency: 'USD',
              value: 108,
            },
          },
        },
      },
    },
  ],
  ...overrides,
});

export const generateShoppingCart = overrides => ({
  id: 1234,
  giftMessageSelected: true,
  giftWrappingSelected: true,
  items: [
    {
      product: {
        name: 'my product',
        image: {
          url: 'https://test.com/cool.jpg',
        },
        sku: '1234',
      },
      basePrice: 1.23,
      id: 1234,
      quantity: 100,
      prices: {
        price: {
          value: 1.23,
        },
      },
    },
  ],
  totalQuantity: 100,
  possibleOnepageCheckout: false,
  subtotalAmount: 123,
  prices: {
    subtotalExcludingTax: { value: 123 },
    subtotalIncludingTax: { value: 124 },
  },
  ...overrides,
});

export const sampleGraphQLCart = {
  __typename: 'Cart',
  id: '4yG9W7GyEUB5z1Sovd9Htf2IlmdoArVn',
  total_quantity: 4,
  prices: {
    __typename: 'CartPrices',
    subtotal_excluding_tax: { __typename: 'Money', value: 432 },
    subtotal_including_tax: { __typename: 'Money', value: 432 },
  },
  items: [
    {
      __typename: 'ConfigurableCartItem',
      id: '477',
      can_apply_msrp: false,
      formatted_price: '<span class="price">$108.00</span>',
      product_configuration_options: [
        { __typename: 'ProductOptions', product: null },
        { __typename: 'ProductOptions', product: null },
      ],
      product: {
        __typename: 'ConfigurableProduct',
        id: 1144,
        name: 'Selena Pants',
        url_key: 'selena-pants',
        url_suffix: '.html',
        is_visible_in_site_visibility: true,
        sku: 'VP01',
        product_has_url: true,
        image: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
        },
        thumbnail: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
          label: 'Main',
        },
      },
      prices: {
        __typename: 'CartItemPrices',
        price: { __typename: 'Money', currency: 'USD', value: 108 },
      },
      quantity: 1,
      configurable_options: [
        {
          __typename: 'SelectedConfigurableOption',
          id: 180,
          option_label: 'Fashion Color',
          value_id: 23,
          value_label: 'Lilac',
        },
        {
          __typename: 'SelectedConfigurableOption',
          id: 183,
          option_label: 'Fashion Size',
          value_id: 30,
          value_label: 'M',
        },
      ],
    },
    {
      __typename: 'ConfigurableCartItem',
      id: '479',
      can_apply_msrp: false,
      formatted_price: '<span class="price">$108.00</span>',
      product_configuration_options: [
        { __typename: 'ProductOptions', product: null },
        { __typename: 'ProductOptions', product: null },
      ],
      product: {
        __typename: 'ConfigurableProduct',
        id: 1144,
        name: 'Selena Pants',
        url_key: 'selena-pants',
        url_suffix: '.html',
        is_visible_in_site_visibility: true,
        sku: 'VP01',
        product_has_url: true,
        image: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
        },
        thumbnail: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
          label: 'Main',
        },
      },
      prices: {
        __typename: 'CartItemPrices',
        price: { __typename: 'Money', currency: 'USD', value: 108 },
      },
      quantity: 2,
      configurable_options: [
        {
          __typename: 'SelectedConfigurableOption',
          id: 180,
          option_label: 'Fashion Color',
          value_id: 23,
          value_label: 'Lilac',
        },
        {
          __typename: 'SelectedConfigurableOption',
          id: 183,
          option_label: 'Fashion Size',
          value_id: 29,
          value_label: 'L',
        },
      ],
    },
    {
      __typename: 'ConfigurableCartItem',
      id: '481',
      can_apply_msrp: false,
      formatted_price: '<span class="price">$108.00</span>',
      product_configuration_options: [
        { __typename: 'ProductOptions', product: null },
        { __typename: 'ProductOptions', product: null },
      ],
      product: {
        __typename: 'ConfigurableProduct',
        id: 1144,
        name: 'Selena Pants',
        url_key: 'selena-pants',
        url_suffix: '.html',
        is_visible_in_site_visibility: true,
        sku: 'VP01',
        product_has_url: true,
        image: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
        },
        thumbnail: {
          __typename: 'ProductImage',
          url:
            'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
          label: 'Main',
        },
      },
      prices: {
        __typename: 'CartItemPrices',
        price: { __typename: 'Money', currency: 'USD', value: 108 },
      },
      quantity: 1,
      configurable_options: [
        {
          __typename: 'SelectedConfigurableOption',
          id: 180,
          option_label: 'Fashion Color',
          value_id: 25,
          value_label: 'Mint',
        },
        {
          __typename: 'SelectedConfigurableOption',
          id: 183,
          option_label: 'Fashion Size',
          value_id: 30,
          value_label: 'M',
        },
      ],
    },
  ],
};

export const fetchedRecs = {
  data: {
    totalResults: 2,
    results: [
      {
        unitId: 'a0ed8163-f9eb-4395-bba8-0d628c34ca1d',
        unitName: 'HMPGTRND',
        unitType: 'primary',
        searchTime: 3,
        totalProducts: 0,
        primaryProducts: 0,
        backupProducts: 0,
        products: [],
        pageType: 'CMS',
        typeId: 'trending',
        storefrontLabel: 'HMPGTRND',
        pagePlacement: 'below-main-content',
        displayNumber: 0,
        displayOrder: 4,
      },
      {
        unitId: 'f11e5d0a-921c-4637-8e0b-f639642e03e9',
        unitName: 'HMPGMP',
        unitType: 'primary',
        searchTime: 22,
        totalProducts: 0,
        primaryProducts: 0,
        backupProducts: 0,
        products: [],
        pageType: 'CMS',
        typeId: 'most-purchased',
        storefrontLabel: 'HMPGMP',
        pagePlacement: 'below-main-content',
        displayNumber: 20,
        displayOrder: 1,
      },
    ],
  },
};
export const sampleGraphQLProduct = {
  __typename: 'ConfigurableProduct',
  id: 1144,
  categories: [
    {
      __typename: 'CategoryTree',
      id: 12,
      breadcrumbs: [{ __typename: 'Breadcrumb', category_id: 11 }],
    },
  ],
  description:
    '<p>The Selena Pants are one of the more form-fitting pieces in the Venia collection. But don\'t be fooled by their appearance. These gems are made with soft pima cotton and just the right amount of stretch.</p><p>Features:</p><ul><li>Cotton waistband</li><li>Drawstring waist</li><li>Sits just below waist</li><li>31" inseam</li><li>Machine wash, line dry</li></ul>',
  media_gallery_entries: [
    {
      __typename: 'MediaGalleryEntry',
      id: 1238,
      label: 'Main',
      position: 1,
      disabled: false,
      file: '/v/p/vp01-ll_main_4.jpg',
    },
  ],
  meta_description:
    "The Selena Pants are one of the more form-fitting pieces in the Venia collection. But don't be fooled by their appearance. These gems are made with soft pima cotton and just the right amount of stretch. Features: Cotton waistband. Drawstring waist. Sits ",
  name: 'Selena Pants',
  price: {
    __typename: 'ProductPrices',
    regularPrice: {
      __typename: 'Price',
      amount: { __typename: 'Money', currency: 'USD', value: 108 },
    },
  },
  sku: 'VP01',
  small_image:
    'https://master-7rqtwti-5k2ulbou6q5ti.us-4.magentosite.cloud/media/catalog/product/cache/18e351d3d205c0264ac03dce60b9880e/v/p/vp01-ll_main_4.jpg',
  url_key: 'selena-pants',
  configurable_options: [
    {
      __typename: 'ConfigurableProductOptions',
      attribute_code: 'fashion_color',
      attribute_id: '180',
      id: 96,
      label: 'Fashion Color',
      values: [
        {
          __typename: 'ConfigurableProductOptionsValues',
          default_label: 'Lilac',
          label: 'Lilac',
          store_label: 'Lilac',
          use_default_value: true,
          value_index: 23,
          swatch_data: { __typename: 'ColorSwatchData', value: '#dcd5e1' },
        },
      ],
    },
    {
      __typename: 'ConfigurableProductOptions',
      attribute_code: 'fashion_size',
      attribute_id: '183',
      id: 97,
      label: 'Fashion Size',
      values: [
        {
          __typename: 'ConfigurableProductOptionsValues',
          default_label: 'L',
          label: 'L',
          store_label: 'L',
          use_default_value: true,
          value_index: 29,
          swatch_data: { __typename: 'TextSwatchData', value: 'L' },
        },
      ],
    },
  ],
  variants: [
    {
      __typename: 'ConfigurableVariant',
      attributes: [
        {
          __typename: 'ConfigurableAttributeOption',
          code: 'fashion_color',
          value_index: 27,
        },
        {
          __typename: 'ConfigurableAttributeOption',
          code: 'fashion_size',
          value_index: 31,
        },
      ],
      product: {
        __typename: 'SimpleProduct',
        id: 794,
        media_gallery_entries: [
          {
            __typename: 'MediaGalleryEntry',
            id: 804,
            disabled: false,
            file: '/v/p/vp01-la_main_2.jpg',
            label: 'Main',
            position: 1,
          },
        ],
        sku: 'VP01-LA-S',
        stock_status: 'IN_STOCK',
        price: {
          __typename: 'ProductPrices',
          regularPrice: {
            __typename: 'Price',
            amount: { __typename: 'Money', currency: 'USD', value: 108 },
          },
        },
      },
    },
  ],
};
