import kebabCase from 'lodash/kebabCase';
//TODO: implementation should be changed in the future
export const getProductPageUrl = ({ name }) => `/${kebabCase(name)}.html`;
