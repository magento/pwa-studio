import React, { Component } from 'react';

import mergeClasses from '@magento/peregrine/lib/util/shallowMerge';
import getDisplayName from '@magento/venia-ui/lib/util/getDisplayName';

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

export { mergeClasses, mergeClasses as useStyle };

export default classify;
