module.exports = api => {
  const config = {
    presets: ['@magento/peregrine', '@babel/preset-react'],
    plugins: [
      'babel-plugin-transform-es2015-modules-commonjs',
      '@babel/plugin-proposal-class-properties',
    ],
    exclude: [/packages\/babel-preset-peregrine\//],
  };
  if (api.env() === 'development') {
    // Ignore everything with underscores except stories in dev mode
    config.exclude.push(/\/__(tests?|mocks|fixtures|helpers|dist)__\//);
  }
  return config;
};
