const envToConfig = require('../envToConfig');

test('converts namespaced env vars to config object and casts values', () => {
    Object.assign(process.env, {
        UPWARD_JS_ONE_TWO: 'false',
        UPWARD_JS_THREE_FOUR: 'trUE',
        UPWARD_JS_FIVE_SIX_SEVEN: '9.4',
        UPWARD_JS_EIGHTNINE: 'eight and nine'
    });
    expect(envToConfig()).toEqual({
        oneTwo: false,
        threeFour: true,
        fiveSixSeven: 9.4,
        eightnine: 'eight and nine'
    });
});
