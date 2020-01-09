import React, { useMemo } from 'react';

import classes from './DrawerFooter.css';

// import { mergeClasses } from '../../../../venia-ui/lib/classify';

const Button = () => <div />;

const DrawerFooter = props => {
    const { buttonsConfig, classes: buttonsClasses } = props;
    //  const classes = mergeClasses(defaultClasses, buttonsClasses);

    const buttons = useMemo(() => {
        return buttonsConfig.map(buttonConfig => {
            const { contents, key, ...rest } = buttonConfig;
            return (
                <Button key={key} {...rest}>
                    {contents}
                </Button>
            );
        });
    }, [buttonsConfig]);

    return <div className={classes.root}>{buttons}</div>;
};

export default DrawerFooter;
