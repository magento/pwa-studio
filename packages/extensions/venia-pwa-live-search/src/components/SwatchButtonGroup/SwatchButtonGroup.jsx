/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { SwatchButton } from '../SwatchButton';

const MAX_SWATCHES = 5;

export const SwatchButtonGroup = ({
  isSelected,
  swatches,
  showMore,
  productUrl,
  onClick,
  sku
}) => {
  const moreSwatches = swatches.length > MAX_SWATCHES;
  const numberOfOptions = moreSwatches ? MAX_SWATCHES - 1 : swatches.length;

  return (
    <div className="ds-sdk-product-item__product-swatch-group flex column items-center space-x-2">
      {moreSwatches ? (
        <div className="flex">
          {swatches.slice(0, numberOfOptions).map((swatch) => {
            const checked = isSelected(swatch.id);
            return (
              swatch &&
              swatch.type === 'COLOR_HEX' && (
                <div
                  key={swatch.id}
                  className="ds-sdk-product-item__product-swatch-item mr-2 text-sm text-primary"
                >
                  <SwatchButton
                    id={swatch.id}
                    value={swatch.value}
                    type={swatch.type}
                    checked={!!checked}
                    onClick={() => onClick([swatch.id], sku)}
                  />
                </div>
              )
            );
          })}
          <a href={productUrl} className="hover:no-underline">
            <div className="ds-sdk-product-item__product-swatch-item text-sm text-primary">
              <SwatchButton
                id="show-more"
                value={`+${swatches.length - numberOfOptions}`}
                type="TEXT"
                checked={false}
                onClick={showMore}
              />
            </div>
          </a>
        </div>
      ) : (
        swatches.slice(0, numberOfOptions).map((swatch) => {
          const checked = isSelected(swatch.id);
          return (
            swatch &&
            swatch.type === 'COLOR_HEX' && (
              <div
                key={swatch.id}
                className="ds-sdk-product-item__product-swatch-item text-sm text-primary"
              >
                <SwatchButton
                  id={swatch.id}
                  value={swatch.value}
                  type={swatch.type}
                  checked={!!checked}
                  onClick={() => onClick([swatch.id], sku)}
                />
              </div>
            )
          );
        })
      )}
    </div>
  );
};
