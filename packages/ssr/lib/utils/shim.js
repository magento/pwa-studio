const React = require('react');

// Suppress useLayoutEffect since it's not SSR compatible
React.useLayoutEffect = () => void 0;
React.Suspense = props =>
    React.createElement(React.Fragment, null, props.children);
