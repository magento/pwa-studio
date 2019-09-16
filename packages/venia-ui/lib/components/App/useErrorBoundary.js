import React, { Component, useMemo } from 'react';

export const useErrorBoundary = WrappedComponent =>
    useMemo(
        () =>
            class ErrorBoundary extends Component {
                constructor(props) {
                    super(props);

                    this.state = { renderError: null };
                }

                static getDerivedStateFromError(renderError) {
                    return { renderError };
                }

                render() {
                    const { props, state } = this;
                    const { renderError } = state;

                    return (
                        <WrappedComponent
                            {...props}
                            renderError={renderError}
                        />
                    );
                }
            },
        []
    );
