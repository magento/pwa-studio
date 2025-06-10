/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

import CartIcon from '../../icons/cart.svg';

const AddToCartButton = ({ onClick }) => {
  return (
    <div className="ds-sdk-add-to-cart-button">
      <button
        className="flex items-center justify-center text-white text-xs rounded-full h-[32px] w-full p-sm"
        style={{
          backgroundColor: '#464646'
        }}
        onClick={onClick}
      >
        <img src={CartIcon} className="w-[24px] pr-4" />
        {/* <CartIcon className="w-[24px] pr-4" /> */}
        Add To Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
