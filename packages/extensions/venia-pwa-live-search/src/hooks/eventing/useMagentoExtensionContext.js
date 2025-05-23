import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_MAGENTO_EXTENSION_CONTEXT } from '../../queries/eventing/getMagentoExtensionContext.gql.js';
import mse from '@adobe/magento-storefront-events-sdk';

const useMagentoExtensionContext = () => {
  const { data, error } = useQuery(GET_MAGENTO_EXTENSION_CONTEXT);
  if (
    (process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test') &&
    error
  ) {
    console.error('Magento Extension context query failed!', error);
  }

  useEffect(() => {
    let magentoExtensionContext = null;
    if (data && data.magentoExtensionContext) {
      magentoExtensionContext = {
        magentoExtensionVersion:
          data.magentoExtensionContext.magento_extension_version,
      };
    }
    mse.context.setMagentoExtension(magentoExtensionContext);
  }, [data]);
};

export default useMagentoExtensionContext;
