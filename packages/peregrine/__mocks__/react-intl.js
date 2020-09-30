const reactIntl = jest.requireActual('react-intl');
const intl = reactIntl.createIntl({
    locale: 'en'
});

module.exports = {
    ...reactIntl,
    useIntl: jest.fn(() => intl)
};
