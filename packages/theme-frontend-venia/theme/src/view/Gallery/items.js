import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import GalleryItem from './item';
import { fixedObserver, initObserver } from 'src/utils';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);
const createCollection = initObserver(fixedObserver);

// inline the placeholder elements, since they're constant
const placeholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

// initialize the state with a one-page observer, `collection`
// when the observer completes, set `done` to `true`
const initState = () => ({
    collection: createCollection(pageSize),
    done: false
});

class GalleryItems extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object)
    };

    state = initState();

    componentWillReceiveProps({ items }) {
        if (items === emptyData) {
            return;
        }

        this.setState(initState);
    }

    render() {
        const { items } = this.props;
        const { done } = this.state;

        if (items === emptyData) {
            return placeholders;
        }

        return items.map(item => (
            <GalleryItem
                key={item.key}
                item={item}
                showImage={done}
                onLoad={this.onLoad}
                onError={this.onError}
            />
        ));
    }

    onLoad = key => {
        const { done } = this.state.collection.next(key);

        this.setState(() => ({ done }));
    };

    onError = key => {
        const { done } = this.state.collection.next(key);

        console.error(`Error loading image: ${key}`);
        this.setState(() => ({ done }));
    };
}

export { GalleryItems as default, emptyData };
