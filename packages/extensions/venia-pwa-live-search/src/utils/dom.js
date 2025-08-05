// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.

export const moveToTop = () => {
    window.scrollTo({ top: 0 });
};

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
