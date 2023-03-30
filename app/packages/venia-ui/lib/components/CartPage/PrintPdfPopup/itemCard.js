import React, { useState } from 'react';

import defaultClasses from './itemCard.module.css';
import { usePdfPopupProduct } from '@magento/peregrine/lib/talons/CartPage/PdfPopupProduct/usePdfPopupProduct';

const ItemCard = props => {
    const { item, tooglePrice } = props;
    const [itemPrice, setItemPrice] = useState(item.prices.price.value);
    const [currency, setCurrency] = useState(item.prices.price.currency);

    const talonProps = usePdfPopupProduct({
        ...props
    });
    const { product } = talonProps;
    const { image } = product;

    return (
        <main className={defaultClasses.container}>
            <article className={defaultClasses.imgContainer}>
                <img src={image} alt="" />
            </article>
            <section>
                {item.configurable_options.map((individualOption, index) => {
                    return (
                        <article key={index} className={defaultClasses.optionsContainer}>
                            <article>{individualOption.option_label}:</article>
                            <article>{individualOption.value_label}</article>
                        </article>
                    );
                })}
            </section>
            <section className={defaultClasses.priceContainer}>
                {!tooglePrice ? (
                    <span> {itemPrice}</span>
                ) : (
                    <input
                        className={defaultClasses.inputPrice}
                        type="text"
                        value={itemPrice}
                        onChange={e => setItemPrice(e.target.value)}
                    />
                )}
                <span>{currency}</span>
            </section>
        </main>
    );
};

export default ItemCard;
