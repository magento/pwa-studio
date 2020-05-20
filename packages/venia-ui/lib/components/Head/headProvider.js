import React from 'react';
import {HelmetProvider as HeadProvider} from 'react-helmet-async';

const VeniaHeadProvider = props => {
    if (VeniaHeadProvider.canUseDom !== null) {
        HeadProvider.canUseDOM = VeniaHeadProvider.canUseDom;
    }
    return ( <HeadProvider> {props.children} </HeadProvider>);
};

VeniaHeadProvider.canUseDom = null;
export default VeniaHeadProvider;
