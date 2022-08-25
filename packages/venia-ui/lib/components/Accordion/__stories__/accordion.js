import React from 'react';
import { storiesOf } from '@storybook/react';

import Accordion from '../accordion';
import Section from '../section';

const stories = storiesOf('Components/Accordion', module);

const firstContent = 'First Content Here';
const secondContent = 'Second Contents Here';
const thirdContent = 'Third Contents Here';

stories.add('Default', () => {
    return (
        <Accordion>
            <Section title="First" id="first">
                {firstContent}
            </Section>
            <Section title="Second" id="second">
                {secondContent}
            </Section>
            <Section title="Third" id="third">
                {thirdContent}
            </Section>
        </Accordion>
    );
});

stories.add('A section open initially', () => {
    return (
        <Accordion>
            <Section title="First" id="first">
                {firstContent}
            </Section>
            <Section title="Second" isOpen={true} id="second">
                {secondContent}
            </Section>
            <Section title="Third" id="third">
                {thirdContent}
            </Section>
        </Accordion>
    );
});

stories.add('Multiple sections open initially', () => {
    return (
        <Accordion>
            <Section title="First" id="first">
                {firstContent}
            </Section>
            <Section title="Second" isOpen={true} id="second">
                {secondContent}
            </Section>
            <Section title="Third" isOpen={true} id="third">
                {thirdContent}
            </Section>
        </Accordion>
    );
});

stories.add('One section allowed open at a time', () => {
    return (
        <Accordion canOpenMultiple={false}>
            <Section title="First" id="first">
                {firstContent}
            </Section>
            <Section title="Second" id="second">
                {secondContent}
            </Section>
            <Section title="Third" id="third">
                {thirdContent}
            </Section>
        </Accordion>
    );
});

stories.add('One section allowed open + A section open initially', () => {
    return (
        <Accordion canOpenMultiple={false}>
            <Section title="First" id="first">
                {firstContent}
            </Section>
            <Section title="Second" isOpen={true} id="second">
                {secondContent}
            </Section>
            <Section title="Third" id="third">
                {thirdContent}
            </Section>
        </Accordion>
    );
});

stories.add(
    'Multiple sections open initially but only one section allowed open',
    () => {
        return (
            <Accordion canOpenMultiple={false}>
                <Section title="First" id="first">
                    {firstContent}
                </Section>
                <Section title="Second" isOpen={true} id="second">
                    {secondContent}
                </Section>
                <Section title="Third" isOpen={true} id="third">
                    {thirdContent}
                </Section>
            </Accordion>
        );
    }
);
