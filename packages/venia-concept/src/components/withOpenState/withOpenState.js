import React, { Component } from 'react';

const withOpenState = (initialState = false) => WrappedComponent =>
    class extends Component {
        state = {
            isOpen: initialState
        };

        changeState = isOpen => {
            this.setState({
                isOpen
            });
        };

        open = () => this.changeState(true);

        close = () => this.changeState(false);

        toggle = () => this.changeState(!this.state.isOpen);

        render() {
            const { open, close, toggle } = this;
            const { isOpen } = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    isOpen={isOpen}
                    open={open}
                    close={close}
                    toggle={toggle}
                />
            );
        }
    };

export default withOpenState;
