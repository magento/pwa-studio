/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from './store';

// Default widget config state
const defaultWidgetConfigState = {
  badge: {
    enabled: false,
    label: '',
    attributeCode: '',
    backgroundColor: '',
  },
  price: {
    showNoPrice: false,
    showRange: true,
    showRegularPrice: true,
    showStrikethruPrice: true,
  },
  attributeSlot: {
    enabled: false,
    attributeCode: '',
    backgroundColor: '',
  },
  addToWishlist: {
    enabled: true,
    placement: 'inLineWithName',
  },
  layout: {
    defaultLayout: 'grid',
    allowedLayouts: [],
    showToggle: true,
  },
  addToCart: { enabled: true },
  stockStatusFilterLook: 'radio',
  swatches: {
    enabled: false,
    swatchAttributes: [],
    swatchesOnPage: 10,
  },
  multipleImages: {
    enabled: true,
    limit: 10,
  },
  compare: {
    enabled: true,
  },
};

const WidgetConfigContext = createContext(defaultWidgetConfigState);

const WidgetConfigContextProvider = ({ children }) => {
  const storeCtx = useStore();
  const { environmentId, storeCode } = storeCtx;

  const [widgetConfig, setWidgetConfig] = useState(defaultWidgetConfigState);
  const [widgetConfigFetched, setWidgetConfigFetched] = useState(false);

  useEffect(() => {
    if (!environmentId || !storeCode) {
      return;
    }

    if (!widgetConfigFetched) {
      getWidgetConfig(environmentId, storeCode)
        .then((results) => {
          const newWidgetConfig = {
            ...defaultWidgetConfigState,
            ...results,
          };
          setWidgetConfig(newWidgetConfig);
          setWidgetConfigFetched(true);
        })
        .finally(() => {
          setWidgetConfigFetched(true);
        });
    }
  }, [environmentId, storeCode, widgetConfigFetched]);

  const getWidgetConfig = async (envId, storeCode) => {
    const fileName = 'widgets-config.json';
    const S3path = `/${envId}/${storeCode}/${fileName}`;
    const widgetConfigUrl = `${WIDGET_CONFIG_URL}${S3path}`;

    const response = await fetch(widgetConfigUrl, {
      method: 'GET',
    });

    if (response.status !== 200) {
      return defaultWidgetConfigState;
    }

    const results = await response.json();
    return results;
  };

  const widgetConfigCtx = {
    ...widgetConfig,
  };

  return (
    <WidgetConfigContext.Provider value={widgetConfigCtx}>
      {widgetConfigFetched && children}
    </WidgetConfigContext.Provider>
  );
};

const useWidgetConfig = () => {
  const widgetConfigCtx = useContext(WidgetConfigContext);
  return widgetConfigCtx;
};

export { WidgetConfigContextProvider, useWidgetConfig };
