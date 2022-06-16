import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartButton.module.css';
import Button from '@magento/venia-ui/lib/components/Button';

const savedCartButton = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const savedCartBtn = (
        <Button priority={'normal'}>
            <FormattedMessage id={'savedCartButton.saveCartBtn'} defaultMessage={'Save Cart'} />
        </Button>
    );

    return <div className={classes.root}>{savedCartBtn}</div>;
};

export default savedCartButton;

savedCartButton.propTypes = {
    classes: shape({
        root: string
    })
};
