/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

export const SwatchButton = ({ id, value, type, checked, onClick }) => {
  const outlineColor = checked
    ? 'border-black'
    : type === 'COLOR_HEX'
    ? 'border-transparent'
    : 'border-gray';

  if (type === 'COLOR_HEX') {
    const color = value.toLowerCase();
    const className = `min-w-[32px] rounded-full p-sm border border-[1.5px] ${outlineColor} h-[32px] outline-transparent`;
    const isWhite = color === '#ffffff' || color === '#fff';
    return (
      <div className={`ds-sdk-swatch-button_${id}`}>
        <button
          key={id}
          className={className}
          style={{
            backgroundColor: color,
            border: !checked && isWhite ? '1px solid #ccc' : undefined,
          }}
          onClick={onClick}
          aria-checked={checked}
        />
      </div>
    );
  }

  if (type === 'IMAGE' && value) {
    const className = `object-cover object-center min-w-[32px] rounded-full p-sm border border-[1.5px] ${outlineColor} h-[32px] outline-transparent`;
    const style = {
      background: `url(${value}) no-repeat center`,
      backgroundSize: 'initial',
    };
    return (
      <div className={`ds-sdk-swatch-button_${value}`}>
        <button
          key={id}
          className={className}
          style={style}
          onClick={onClick}
          aria-checked={checked}
        />
      </div>
    );
  }

  // Assume TEXT type
  const className = `flex items-center bg-white rounded-full p-sm border border-[1.5px]h-[32px] ${outlineColor} outline-transparent`;
  return (
    <div className={`ds-sdk-swatch-button_${value}`}>
      <button
        key={id}
        className={className}
        onClick={onClick}
        aria-checked={checked}
      >
        {value}
      </button>
    </div>
  );
};
