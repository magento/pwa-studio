import React from 'react';

import Heading from './Heading';

export default Heading;
export const H1 = props => <Heading {...props} level={1} />;
export const H2 = props => <Heading {...props} level={2} />;
export const H3 = props => <Heading {...props} level={3} />;
export const H4 = props => <Heading {...props} level={4} />;
export const H5 = props => <Heading {...props} level={5} />;
export const H6 = props => <Heading {...props} level={6} />;
