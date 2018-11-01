import React, { Component } from 'react';
import { arrayOf, string, number, shape } from 'prop-types';
import fixedObserver from 'src/util/fixedObserver';
import initObserver from 'src/util/initObserver';
import GalleryItem from './item';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);
const createCollection = initObserver(fixedObserver);

// inline the placeholder elements, since they're constant
const placeholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

// initialize the state with a one-page observer, `collection`
// when the observer completes, set `done` to `true`
const initState = (prevState, { items }) => ({
    collection: createCollection(items.length),
    done: false
});

class GalleryItems extends Component {
    static propTypes = {
        items: arrayOf(
            shape({
                id: number.isRequired,
                name: string.isRequired,
                small_image: string.isRequired,
                price: shape({
                    regularPrice: shape({
                        amount: shape({
                            value: number.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired
            })
        ).isRequired
    };

    constructor(props) {
        super(props);

        this.state = initState({}, props);
    }

    componentWillReceiveProps(nextProps) {
        const { items } = this.props;
        const { items: nextItems } = nextProps;

        if (nextItems === items) {
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
                key={item.id}
                item={item}
                showImage={done}
                onLoad={this.handleLoad}
                onError={this.handleError}
            />
        ));
    }

    handleLoad = key => {
        const { done } = this.state.collection.next(key);

        this.setState(() => ({ done }));
    };

    handleError = key => {
        const { done } = this.state.collection.next(key);

        this.setState(() => ({ done }));
    };
}

export { GalleryItems as default, emptyData };
