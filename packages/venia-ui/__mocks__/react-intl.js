const React = require('react');
const reactIntl = jest.requireActual('react-intl');
const messages = require('../i18n/en_US.json');
const intl = reactIntl.createIntl({
    locale: 'en',
    messages
});

module.exports = {
    ...reactIntl,
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    ),
    useIntl: jest.fn(() => intl)
};
