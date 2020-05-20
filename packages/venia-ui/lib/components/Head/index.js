import React from 'react';
export { default as HeadProvider } from './headProvider';
import { Helmet } from 'react-helmet-async';
Helmet.defaultProps.defer = false;

export const Link = props => {
    return (<Helmet><link {...props}>{ props.children }</link></Helmet>);
};

export const Meta = props => {
    return (<Helmet><meta {...props}>{ props.children }</meta></Helmet>);
};

export const Style = props => {
    return (<Helmet><style {...props}>{ props.children }</style></Helmet>);
};

export const Title = props => {
    return (<Helmet><title {...props}>{ props.children }</title></Helmet>);
};
