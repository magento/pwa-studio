import React, { useState, useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { Download, PlusCircle, ArrowDown, XCircle } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Button from '../Button';
import Dialog from '../Dialog';
import Icon from '../Icon';
import QuantityStepper from '../QuantityStepper';
import SearchBar from './SearchBar';

import { useStyle } from '../../classify';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { useQuickOrderForm } from '@magento/peregrine/lib/talons/QuickOrderForm/useQuickOrderForm';
import { useAddToQuote } from '@magento/peregrine/lib/talons/QuickOrderForm/useAddToQuote';

import defaultClasses from './quickOrderForm.module.css';

import fastCart from '@magento/venia-ui/lib/assets/fastCart.svg';
import Price from '../Price';

const initialArray = [{ name: '', quantity: 1 }];

const QuickOrderForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { push } = useHistory();

    // States
    const [csvData, setCsvData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState(JSON.parse(JSON.stringify(initialArray)));

    const success = () => {
        displayMessage(
            'success',
            formatMessage({
                id: 'quickOrder.AddedToCartSuccessfully',
                defaultMessage: 'Added to cart successfully'
            })
        );
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(initialArray)));
    };

    // Talons
    const { handleAddCofigItemBySku, isLoading: isLoadingAddQuote } = useAddToQuote();
    const { handleAddProductsToCart, handleCSVFile } = useQuickOrderForm({
        quickOrder: true,
        setCsvErrorType: () => displayMessage('warning', warningMsg),
        setCsvSkuErrorList: () => displayMessage('warning', warningMsg),
        setIsCsvDialogOpen: () => {},
        setProducts,
        success
    });

    // Messages
    const warningMsg = formatMessage({
        id: 'quickOrder.somethingWentWrongTryAgainLater',
        defaultMessage: 'something went wrong, try again later'
    });

    const displayMessage = (type, message, time = 5000) => {
        addToast({
            type: type,
            message,
            timeout: time
        });
    };

    // Effects
    useEffect(() => {
        const downloadCsv = () => {
            const newArr = [...products];
            const newData = [];
            newArr.map(item => {
                if (item.name) {
                    const { sku, quantity } = item;
                    newData.push({
                        sku,
                        quantity
                    });
                }
            });
            setCsvData(newData);
        };
        downloadCsv();
    }, [products]);

    const csvBtn = useMemo(() => {
        if (csvData.length && csvData[0]?.sku) {
            return (
                <CSVLink filename={'quick-order-file.csv'} data={csvData}>
                    <Button className={classes.downloadBtn}>
                        <Icon src={Download} alt="download-icon" />
                        <FormattedMessage
                            id="quickOrder.DownloadYourSampleFile"
                            defaultMessage="Download your sample file"
                        />
                    </Button>
                </CSVLink>
            );
        } else {
            return;
        }
    }, [csvData, classes]);

    // Methods
    const onOrderClick = () => {
        setIsOpen(!isOpen);
        setProducts(JSON.parse(JSON.stringify(initialArray)));
    };

    const handleSearchClick = (product, index) => {
        const newProducts = [...products];

        newProducts[index] = product;
        newProducts[index] = {
            ...newProducts[index],
            quantity: 1
        };
        setProducts([...newProducts, { name: '' }]);
    };

    const handleChangeText = (e, key) => {
        const newProducts = [...products];
        newProducts[key].name = e;
        newProducts[key].price && delete newProducts[key].price;
        setProducts(newProducts);
    };

    const onChangeQty = (value, index) => {
        const newProducts = [...products];
        newProducts[index] = {
            ...newProducts[index],
            quantity: value
        };
        setProducts(newProducts);
    };

    const formatData = data => {
        const dataValidated = [];
        const productArr = [...data];
        for (const element of productArr) {
            if (Object.keys(element).length > 0 && element.sku) {
                dataValidated.push([element.sku, element.quantity]);
            }
        }
        return dataValidated;
    };

    const addToCartClick = () => {
        const dataValidated = formatData(products);
        handleAddProductsToCart(dataValidated);
    };

    const addQuoteClick = () => {
        if (products.filter(ele => ele.sku).length > 0) {
            handleAddCofigItemBySku(products.filter(ele => ele.sku));
        } else {
            return addToast({
                type: 'warning',
                message: <FormattedMessage id="quickOrder.emptyItems" defaultMessage="No items found" />,
                timeout: 5000
            });
        }
    };

    const createOrderClick = () => {
        addToCartClick();
        push('/checkout');
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(initialArray)));
    };

    const addProduct = () => {
        setProducts([...products, {}]);
    };

    const removeProduct = key => {
        const newProducts = JSON.parse(JSON.stringify(products)).filter((ele, index) => index !== key);
        setProducts([...newProducts]);
    };

    const dialogButtonsArray = [
        <div>
            <Button type="button" priority="high" onClick={addToCartClick}>
                <FormattedMessage id="quickOrder.AddToCart" defaultMessage="Add to cart" />
                <Icon className={classes.addCartIcon} src={ArrowDown} alt="arrowDown-icon" />
            </Button>
        </div>,
        process.env.B2BSTORE_VERSION === 'PREMIUM' && (
            <div>
                <Button disabled={isLoadingAddQuote} type="button" priority="high" onClick={addQuoteClick}>
                    <FormattedMessage id="quickOrder.GetQuote" defaultMessage="Get Quote" />
                </Button>
            </div>
        ),
        <div>
            <Button type="button" priority="high" onClick={createOrderClick}>
                <FormattedMessage id="quickOrder.CreateOrder" defaultMessage="Create Order" />
            </Button>
        </div>
    ];

    return (
        <>
            <div className={classes.btnOrderContainer}>
                <Button priority="high" className={`${classes.orderIcon} ${classes.gridBtn}`} onClick={onOrderClick}>
                    <img src={fastCart} alt="Cart icon" />
                </Button>
            </div>
            <div className={classes.quickOrderDialog}>
                <Dialog
                    title={<FormattedMessage id="quickOrder.quickOrderForm" defaultMessage="Quick Order Form" />}
                    isOpen={isOpen}
                    shouldUseButtonsArray={true}
                    buttonsArray={dialogButtonsArray}
                    onCancel={() => setIsOpen(false)}
                >
                    <div>
                        <div className={classes.gridWrapper}>
                            <div>
                                <div className={classes.labalWrapper}>
                                    <div>
                                        <span>
                                            <FormattedMessage id="quickOrder.Items" defaultMessage="Items" />
                                        </span>
                                    </div>
                                    <div>
                                        <span className={classes.mobileHidden}>
                                            <FormattedMessage id="quickOrder.Qty" defaultMessage="Qty" />
                                        </span>
                                    </div>

                                    <div>
                                        <span className={classes.mobileHidden}>
                                            <FormattedMessage id="quickOrder.Price" defaultMessage="Price" />
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.m_1}>
                                    {products &&
                                        products.map((item, key) => (
                                            <div key={key} className={classes.labalWrapper}>
                                                <div className={classes.searchBar}>
                                                    <SearchBar
                                                        isOpen={true}
                                                        handleSearchClick={product => handleSearchClick(product, key)}
                                                        setSearchText={e => handleChangeText(e, key)}
                                                        searchText={item.name}
                                                        quickOrder={true}
                                                        placeholder={formatMessage({
                                                            id: 'quickOrder.SearchProduct',
                                                            defaultMessage: 'Enter SKU or name of product'
                                                        })}
                                                        value={item.name}
                                                    />
                                                </div>
                                                <div className={classes.inputQtyQuick}>
                                                    <QuantityStepper
                                                        min={1}
                                                        initialValue={item.quantity}
                                                        fieldName={`quantity-${key}`}
                                                        textProps={{
                                                            onChange(e) {
                                                                onChangeQty(e.target.value, key);
                                                            },
                                                            disabled: !item?.price
                                                        }}
                                                        classes={{
                                                            button_increment: classes.disable,
                                                            button_decrement: classes.disable,
                                                            root: classes.disable_gap
                                                        }}
                                                    />
                                                </div>
                                                <div className={classes.priceWrapper}>
                                                    {item.stock_status === 'IN_STOCK' && item.price ? (
                                                        <span className={classes.priceText}>
                                                            {' '}
                                                            <Price
                                                                currencyCode={item.price.minimalPrice.amount.currency}
                                                                value={
                                                                    item.price.minimalPrice.amount.value *
                                                                    Number(item.quantity)
                                                                }
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span className={classes.spanUnAailable}>
                                                            {' '}
                                                            <FormattedMessage
                                                                id={'quickOrder.Unavailable'}
                                                                defaultMessage={'Unavailable'}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                                {key === products.length - 1 ? (
                                                    <div className={classes.addbtn}>
                                                        <Button className={classes.downloadBtn} onClick={addProduct}>
                                                            <Icon src={PlusCircle} alt="download-icon" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className={classes.addbtn}>
                                                        <Button
                                                            onClick={() => removeProduct(key)}
                                                            className={`${classes.downloadBtn} ${classes.removeIcon}`}
                                                        >
                                                            <Icon src={XCircle} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div>
                                <div className={classes.uploadContainer}>
                                    <h5 className={classes.uploadHeader}>
                                        <FormattedMessage
                                            id="quickOrder.UploadYourOrder"
                                            defaultMessage="Upload your order"
                                        />
                                    </h5>
                                    <p>
                                        <FormattedMessage
                                            id="quickOrder.HereYouCanUploadOwnFile"
                                            defaultMessage="Here you can upload your own CSV file with products to cart"
                                        />
                                    </p>
                                    <div>
                                        <Button type="button" priority="high" onClick={handleCSVFile}>
                                            <FormattedMessage
                                                id="quickOrder.UploadYourFile"
                                                defaultMessage="Upload your file"
                                            />
                                        </Button>
                                    </div>
                                    {csvBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default QuickOrderForm;
