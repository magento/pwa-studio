/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

import { useWishlist } from '../../context';
import EmptyHeart from '../../icons/emptyHeart.svg';
import FilledHeart from '../../icons/filledHeart.svg';
import { classNames } from '../../utils/dom';

export const WishlistButton = ({ type, productSku }) => {
  const { isAuthorized, wishlist, addItemToWishlist, removeItemFromWishlist } =
    useWishlist();

  const wishlistItemStatus = wishlist?.items_v2?.items.find(
    (ws) => ws.product.sku === productSku
  );
  const isWishlistItem = !!wishlistItemStatus;

  const heart = isWishlistItem ? <FilledHeart /> : <EmptyHeart />;

  const preventBubbleUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleAddWishlist = (e) => {
    preventBubbleUp(e);
    const selectedWishlistId = wishlist?.id;
    if (isAuthorized) {
      addItemToWishlist(selectedWishlistId, {
        sku: productSku,
        quantity: 1,
      });
    } else {
      // FIXME: Update this for AEM/CIF compatibility if needed
      window.location.href = `${window.origin}/customer/account/login/`;
    }
  };

  const handleRemoveWishlist = (e) => {
    preventBubbleUp(e);
    if (!wishlistItemStatus) return;
    removeItemFromWishlist(wishlist?.id, wishlistItemStatus.id);
  };

  return (
    <div
      className={classNames(
        `ds-sdk-wishlist-${type}-button mt-[-2px]`,
        type !== 'inLineWithName'
          ? 'w-[30px] absolute top-0 right-0'
          : 'w-[24px]'
      )}
    >
      <div onClick={isWishlistItem ? handleRemoveWishlist : handleAddWishlist}>
        {heart}
      </div>
    </div>
  );
};
