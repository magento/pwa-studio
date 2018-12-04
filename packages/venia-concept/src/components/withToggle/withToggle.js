import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getDisplayName from 'src/util/getDisplayName';

const withToggle = WrappedComponent =>
    class extends Component {
        static propTypes = {
            defaultOn: PropTypes.bool
        };

        static defaultProps = {
            defaultOn: false
        };

        static displayName = `WithToggle(${getDisplayName(WrappedComponent)})`;

        state = {
            on: this.props.defaultOn
        };

        changeState = on => {
            this.setState({
                on
            });
        };

        setOn = () => this.changeState(true);

        setOff = () => this.changeState(false);

        toggle = () => this.changeState(!this.state.on);

        render() {
            const { setOn, setOff, toggle } = this;
            const { on } = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    on={on}
                    setOn={setOn}
                    setOff={setOff}
                    toggle={toggle}
                />
            );
        }
    };

export default withToggle;
