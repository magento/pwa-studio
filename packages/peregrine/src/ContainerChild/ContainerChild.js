import { createElement, Component } from 'react';
import { func, string, bool } from 'prop-types';

export default class ContainerChild extends Component {
    static propTypes = {
        id: string.isRequired,
        render: func.isRequired,
        /**
         * `processed` prop is injected by @magento/pwa-buildpack
         */
        processed: bool,
        /**
         * `targetContainer` prop is injected by @magento/pwa-buildpack
         */
        targetContainer: string
    };

    /**
     * When the PWA Studio build tooling visits and processes a
     * ContainerChild, it adds the `processed` prop. This enables
     * catching any case where this component was used incorrectly
     */
    componentDidMount() {
        if (process.env.NODE_ENV === 'production') return;
        const { processed, targetContainer, id } = this.props;

        if (!processed) {
            console.warn(
                '"ContainerChild" component was not preprocessed in the build. ' +
                    `This means all extensions targeting "${
                        id
                    }" within Container "${targetContainer}" ` +
                    'were not injected. Please see the "ContainerChild" component docs for further info.'
            );
        }
    }

    render() {
        return this.props.render();
    }
}
