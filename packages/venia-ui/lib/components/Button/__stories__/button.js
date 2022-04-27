import React from 'react';

import Button from '../button';

import { storiesOf } from '@storybook/react';
import { Edit2 } from 'react-feather';

const stories = storiesOf('Components/Button', module);

const SIZES = ['large', 'medium', 'small'];

const ICON_DIMENSIONS = { width: '18px', height: '18px' };

const ButtonStory = props => {
    const { design } = props;

    const clickHandler = () => {
        console.log('Click');
    };

    const buttons = SIZES.map(size => {
        const text = `${design} ${size}`;
        return (
            <>
                <Button
                    key={`${design} ${size}`}
                    design={design}
                    size={size}
                    ariaLabel={`${design} ${size}`}
                    onClick={clickHandler}
                >
                    {text}
                </Button>
                <br />
                <br />
            </>
        );
    });

    const disabledButtons = SIZES.map(size => {
        const text = `${design} ${size}`;
        return (
            <>
                <Button
                    key={`${design} ${size}`}
                    design={design}
                    size={size}
                    ariaLabel={`${design} ${size}`}
                    disabled={true}
                    onClick={clickHandler}
                >
                    {text}
                </Button>
                <br />
                <br />
            </>
        );
    });

    const icon = <Edit2 {...ICON_DIMENSIONS} />;
    const enabledText = 'Enabled';
    const disabledText = 'Disabled';
    const iconsText = 'Icons';
    return (
        <>
            <h2>{enabledText}</h2>
            {buttons}
            <h2>{disabledText}</h2>
            {disabledButtons}
            <h2>{iconsText}</h2>
            <div>
                <Button
                    design={design}
                    ariaLabel={`${design} Left Icon`}
                    leftIcon={icon}
                    onClick={clickHandler}
                >
                    {design}
                </Button>
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Left Icon`}
                    rightIcon={icon}
                    onClick={clickHandler}
                >
                    {design}
                </Button>
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Dual Icon`}
                    leftIcon={icon}
                    rightIcon={icon}
                    onClick={clickHandler}
                >
                    {design}
                </Button>
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Icon`}
                    leftIcon={icon}
                    onClick={clickHandler}
                />
                <br />
                <br />
                <Button
                    design={design}
                    ariaLabel={`${design} Icon`}
                    leftIcon={icon}
                    rightIcon={icon}
                    onClick={clickHandler}
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
