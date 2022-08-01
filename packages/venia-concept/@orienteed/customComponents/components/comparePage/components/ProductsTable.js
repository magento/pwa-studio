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
                        <th scope="row" className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.product'} defaultMessage="Product" />
                            </span>
                        </th>
                        {productsItems?.map(item => (
                            <td key={item.product.sku + 'tbody1'} className={classes.cell}>
                                <ProductsCard deleteProduct={deleteProduct} key={item.id} item={item} />
                            </td>
                        ))}
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th className={classes.cell}>
                            <span>
                                <FormattedMessage
                                    id={'compareProducts.fashionMaterial'}
                                    defaultMessage="Fashion Material"
                                />
                            </span>
                        </th>
                        {productsItems?.map(product => (
                            <td key={product.sku + 'tbody3'} className={classes.cell}>
                                <span>{product.attributes.find(({ code }) => code === 'fashion_material').value}</span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.fashionStyle'} defaultMessage="Fashion Style" />
                            </span>
                        </th>
                        {productsItems?.map(product => (
                            <td key={product.sku + 'tbody3'} className={classes.cell}>
                                <span>{product.attributes.find(({ code }) => code === 'fashion_style').value}</span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.fashionColor'} defaultMessage="Fashion Color" />
                            </span>
                        </th>
                        {productsItems?.map(product => (
                            <td key={product.sku + 'tbody3'} className={classes.cell}>
                                <span>{product.attributes.find(({ code }) => code === 'fashion_color').value}</span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th scope="row" className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.SKU'} defaultMessage="SKU" />
                            </span>
                        </th>
                        {productsItems?.map(({ product }) => (
                            <td key={product.sku + 'tbody2'} className={classes.cell}>
                                <span>{product.sku}</span>
                            </td>
                        ))}
                    </tr>

                    <tr>
                        <th className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.Description'} defaultMessage="Description" />
                            </span>
                        </th>
                        {productsItems?.map(({ product }) => (
                            <td key={product.sku + 'tbody3'} className={classes.cell}>
                                <span className={classes.description}>
                                    <RichText content={product.description?.html} />
                                </span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th className={classes.cell}>
                            <span>
                                <FormattedMessage id={'compareProducts.hasVideo'} defaultMessage="Has Video" />
                            </span>
                        </th>
                        {productsItems?.map(product => (
                            <td key={product.sku + 'tbody3'} className={classes.cell}>
                                <span>{product.attributes.find(({ code }) => code === 'has_video').value}</span>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
