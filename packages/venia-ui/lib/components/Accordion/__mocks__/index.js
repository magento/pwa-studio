import React from 'react';

const MockAccordion = jest.fn(({ children, ...props }) => (
    <mock-Accordion {...props}>{children}</mock-Accordion>
));

const MockSection = jest.fn(({ children, ...props }) => (
    <mock-Section {...props}>{children}</mock-Section>
));

export { MockAccordion as Accordion };
export { MockSection as Section };
