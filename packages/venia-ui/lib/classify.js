import React, { Component } from 'react';

import getDisplayName from './util/getDisplayName';

import { useStyle } from '@magento/peregrine/lib/context/style';
import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';

const classify = defaultClasses => WrappedComponent =>
    class extends Component {
        static displayName = `Classify(${getDisplayName(WrappedComponent)})`;

        render() {
            const { className, classes, ...restProps } = this.props;
            const classNameAsObject = className ? { root: className } : null;
            const finalClasses = mergeClasses(
                defaultClasses,
                classNameAsObject,
                classes
            );

            return <WrappedComponent {...restProps} classes={finalClasses} />;
        }
    };

export { mergeClasses, useStyle };

export default classify;
