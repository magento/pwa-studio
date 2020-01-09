import React, { useMemo } from 'react';

import defaultClasses from './DrawerFooter.css';

// TODO check if this usage is valid according to the usecase
import Button from '../../../../venia-ui/lib/components/Button';
import { mergeClasses } from '../../../../venia-ui/lib/classify';

const DrawerFooter = props => {
    const { buttonsConfig, classes: buttonsClasses } = props;
    const classes = mergeClasses(defaultClasses, buttonsClasses);

    const buttons = useMemo(() => {
        return buttonsConfig.map(buttonConfig => {
            const { contents, ...rest } = buttonConfig;
            return <Button {...rest}>{contents}</Button>;
        });
    }, [buttonsConfig]);

    return <div className={classes.root}>{buttons}</div>;
};

export default DrawerFooter;
