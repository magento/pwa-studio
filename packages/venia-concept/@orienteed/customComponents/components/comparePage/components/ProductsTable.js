import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ProductsCard from './ProductCard';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './ProductsTable.module.css';
const ProductsTable = ({ productsItems, deleteProduct }) => {
    const classes = useStyle(defaultClasses);
    return (
        <div className={classes.tableWrapper}>
            <table className={classes.productTable}>
                <caption className={classes.tableCaption}>
                    <FormattedMessage id={'compareProducts.CompareProducts'} defaultMessage="Compare Products" />
                </caption>
                <thead>
                    <tr>
                        <th className={classes.cell} scope="row">
                            <span> </span>
                        </th>
                        {productsItems?.map(item => <td key={item.product.sku + 'thead'} className={classes.cell} />)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {productsItems.length > 0 && (
                            <th scope="row" className={classes.cell}>
                                <span>
                                    <FormattedMessage id={'compareProducts.product'} defaultMessage="Product" />
                                </span>
                            </th>
                        )}
                        {productsItems?.map(item => (
                            <td key={item.product.sku + 'tbody1'} className={classes.cell}>
                                <ProductsCard deleteProduct={deleteProduct} key={item.id} item={item} />
                            </td>
                        ))}
                    </tr>
                    {productsItems.length > 0 &&
                        productsItems[0].attributes?.map(attribute => {
                            let attributeProducts = productsItems.map(({ attributes }) =>
                                attributes.find(({ code }) => code === attribute.code)
                            );
                            let inValidValues = attributeProducts.every(({ value }) => value === 'N/A');
                            if (!inValidValues) {
                                return (
                                    <tr key={attribute.code}>
                                        <th className={classes.cell}>
                                            <span>
                                                {attribute.code
                                                    .split('_')
                                                    .join(' ')
                                                    .replace(/(^[a-z])/i, (str, firstLetter) =>
                                                        firstLetter.toUpperCase()
                                                    )}
                                            </span>
                                        </th>
                                        {productsItems?.map(product => (
                                            <td key={product.uid + 'tbody3'} className={classes.cell}>
                                                <span>
                                                    {attribute.code === 'description' ? (
                                                        <span className={classes.description}>
                                                            <RichText
                                                                content={
                                                                    product.attributes.find(
                                                                        ({ code }) => code === attribute.code
                                                                    ).value
                                                                }
                                                            />
                                                        </span>
                                                    ) : (
                                                        product.attributes.find(({ code }) => code === attribute.code)
                                                            .value
                                                    )}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            }
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
