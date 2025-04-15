import RecommendationsClient from '@magento/recommendations-js-sdk';
import { useEffect, useState, useRef } from 'react';
import { PageTypes, PRODUCT } from '../constants';
import { mse } from '@magento/venia-data-collector';

const useRecsData = props => {
  const [recs, setRecs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fired = useRef(false);
  const stale = useRef(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  if (
    (process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test') &&
    (!props || !props.pageType)
  ) {
    throw new Error(
      'Headless Recommendations: PageType is required to fetch recommendations.',
    );
  } else if (props.pageType && !PageTypes.includes(props.pageType)) {
    throw new Error(
      `Headless Recommendations: ${
        props.pageType
      } is not a valid pagetype. Valid types include ${JSON.stringify(
        PageTypes,
      )}`,
    );
  }
  const { pageType } = props;
  const storefrontContext = mse.context.getStorefrontInstance();
  const product = mse.context.getProduct();

  useEffect(() => {
    const fetchRecs = async () => {
      const storefront = { ...storefrontContext, pageType };

      const client = new RecommendationsClient(storefront);

      let currentSku;
      if (pageType === PRODUCT) {
        currentSku = product.sku;
      }

      const fetchProps = {
        ...props,
        currentSku,
      };
      let res;

      try {
        setIsLoading(true);
        fired.current = true;
        stale.current = false;
        mse.publish.recsRequestSent({ pageContext: { pageType } });

        res = await client.fetchPreconfigured(fetchProps);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        setError(e);
      }
      if (res) {
        const { data } = res;
        mse.context.setRecommendations({ units: data.results });
        mse.publish.recsResponseReceived();
        setIsLoading(false);
        setRecs(data);
      }
    };
    if (
      ((!fired.current && !recs) || stale.current) &&
      PageTypes.includes(pageType) &&
      storefrontContext !== undefined &&
      storefrontContext.environmentId &&
      ((pageType === PRODUCT &&
        product !== undefined &&
        product.sku !== undefined) ||
        pageType !== PRODUCT)
    ) {
      fetchRecs();
    }
  }, [pageType, props, recs, storefrontContext, product]);

  useEffect(() => {
    if (
      product &&
      product.sku &&
      (!currentProduct || product.sku !== currentProduct.sku)
    ) {
      setCurrentProduct(product);
    }
  }, [product,currentProduct]);

  useEffect(() => {
    if (currentProduct && recs && fired.current === true) {
      stale.current = true;
    }
  }, [currentProduct,recs]);

  return { data: recs, isLoading, error };
};

export default useRecsData;
