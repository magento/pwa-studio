const reactIntl = jest.requireActual('react-intl');
const intl = reactIntl.createIntl({
    locale: 'en'
});

module.exports = {
    ...reactIntl,
    FormattedMessage: jest.fn(({ defaultMessage }) => defaultMessage),
    useIntl: jest.fn(() => intl)
};
