import React from 'react';

import Button from '../button';

import { storiesOf } from '@storybook/react';
import { Edit2 } from 'react-feather';

const stories = storiesOf('Components/Button', module);

const SIZES = ['large', 'medium', 'small'];

const ICON_DIMENSIONS = { width: '18px', height: '18px' };

const ButtonStory = props => {
    const { design } = props;

    const buttons = SIZES.map(size => {
        return (
            <>
                <Button
                    key={`${design} ${size}`}
                    design={design}
                    size={size}
                    ariaLabel={`${design} ${size}`}
                    text={`${design} ${size}`}
                />
                <br />
                <br />
            </>
        );
    });

    const disabledButtons = SIZES.map(size => {
        return (
            <>
                <Button
                    key={`${design} ${size}`}
                    design={design}
                    size={size}
                    ariaLabel={`${design} ${size}`}
                    text={`${design} ${size}`}
                    disabled={true}
                />
                <br />
                <br />
            </>
        );
    });

    const icon = <Edit2 {...ICON_DIMENSIONS}/>;
    return (
        <>
            <h2>Enabled</h2>
            {buttons}
            <h2>Disabled</h2>
            {disabledButtons}
            <h2>Icons</h2>
            <div>
                <Button
                    design={design}
                    ariaLabel={`${design} Left Icon`}
                    text={design}
                    leftIcon={icon}
                />
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Left Icon`}
                    text={design}
                    rightIcon={icon}
                />
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Dual Icon`}
                    text={design}
                    leftIcon={icon}
                    rightIcon={icon}
                />
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Icon`}
                    leftIcon={icon}
                />
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Icon`}
                    leftIcon={icon}
                    rightIcon={icon}
                />
            </div>
        </>
    );
};

stories.add('Primary', () => {
    return <ButtonStory design="primary" />;
});

stories.add('Secondary', () => {
    return <ButtonStory design="secondary" />;
});

stories.add('Tertiary', () => {
    return <ButtonStory design="tertiary" />;
});
