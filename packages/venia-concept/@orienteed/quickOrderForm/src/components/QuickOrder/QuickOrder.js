import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Download, PlusCircle, ArrowDown, XCircle } from 'react-feather';

import Dialog from '../Dialog';
import SearchBar from '../SearchBar';
import QuantityStepper from '@orienteed/customComponents/components/QuantityStepper/quantity';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { useToasts } from '@magento/peregrine';
import { useAddProductsByCSV } from '../../talons/useAddProductsByCSV';

import defaultClasses from './QuickOrder.module.css';
import fastCart from './Icons/fastCart.svg';

const iniArray = [{ name: '', quantity: 1 }];

const AddQuickOrder = props => {
    const [, { addToast }] = useToasts();
    const { push } = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState(
        JSON.parse(JSON.stringify(iniArray))
    );
    const [csvData, setCsvData] = useState([]);
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const warningMsg = formatMessage({
        id: 'quickOrder.somethingWentWrongTryAgainLater',
        defaultMessage: 'something went wrong, try again later'
    });
    const success = () => {
        displayMessage(
            'success',
            formatMessage({
                id: 'quickOrder.AddedToCartSuccessfully',
                defaultMessage: 'Added to cart successfully'
            })
        );
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
    };
    const { handleAddProductsToCart, handleCSVFile } = useAddProductsByCSV({
        quickOrder: true,
        setCsvErrorType: () => displayMessage('warning', warningMsg),
        setCsvSkuErrorList: () => displayMessage('warning', warningMsg),
        setIsCsvDialogOpen: () => {},
        setProducts,
        success
    });

    const displayMessage = (type, message, time = 5000) => {
        addToast({
            type: type,
            message,
            timeout: time
        });
    };
    useEffect(() => {
        downloadCsv();
    }, [products]);

    const onOrderClick = () => {
        setIsOpen(!isOpen);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
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
        for (let i = 0; i < productArr.length; i++) {
            if (Object.keys(productArr[i]).length > 0 && productArr[i].sku) {
                dataValidated.push([productArr[i].sku, productArr[i].quantity]);
            }
        }
        return dataValidated;
    };
    const addToCartClick = () => {
        const dataValidated = formatData(products);
        handleAddProductsToCart(dataValidated);
    };
    const addQuoteClick = () => {
        displayMessage('warning', warningMsg);
        //TODO => we are still wating to migrate this feature from the template to b2bstore
    };
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
    const createOrderClick = () => {
        addToCartClick();
        push('/checkout');
        setIsOpen(false);
        setProducts(JSON.parse(JSON.stringify(iniArray)));
    };
    const addProduct = () => {
        setProducts([...products, {}]);
    };
    const removeProduct = key => {
        const newProducts = JSON.parse(JSON.stringify(products)).filter(
            (ele, index) => index !== key
        );
        setProducts([...newProducts]);
    };
    const quantitySelector = (item, id) => (
        <div className={classes.inputQtyQuick}>
            <QuantityStepper
                min={1}
                value={item.quantity}
                onChange={e => onChangeQty(e, id)}
            />
        </div>
    );
    return (
        <>
            <div className={classes.btnOrderContainer}>
                <Button
                    priority="high"
                    className={`${classes.orderIcon} ${classes.gridBtn}`}
                    onClick={onOrderClick}
                >
                    <img src={fastCart} alt="Cart icon" />
                </Button>
            </div>
            <div className={classes.quickOrderDialog}>
                <Dialog
                    title=
                  {  <FormattedMessage
                    id="quickOrder.quickOrderForm"
                    defaultMessage="Quick Order Form"
                />}
                    shouldHideCancelButton={true}
                    isOpen={isOpen}
                    shouldShowButtons={false}
                    onCancel={() => setIsOpen(false)}
                    dialogName="DialogQuick"
                >
                    <div>
                        <div className={classes.gridWrapper}>
                            <div>
                                <div className={classes.labalWrapper}>
                                    <div>
                                        <span>
                                            <FormattedMessage
                                                id="quickOrder.Items"
                                                defaultMessage="Items"
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <span className={classes.mobileHidden}>
                                            <FormattedMessage
                                                id="quickOrder.Qty"
                                                defaultMessage="Qty"
                                            />
                                        </span>
                                    </div>

                                    <div>
                                        <span className={classes.mobileHidden}>
                                            <FormattedMessage
                                                id="quickOrder.Price"
                                                defaultMessage="Price"
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.m_1}>
                                    {products &&
                                        products.map((item, key) => (
                                            <div
                                                key={key}
                                                className={classes.labalWrapper}
                                            >
                                                <div
                                                    className={
                                                        classes.searchBar
                                                    }
                                                >
                                                    <SearchBar
                                                        isOpen={true}
                                                        handleSearchClick={product =>
                                                            handleSearchClick(
                                                                product,
                                                                key
                                                            )
                                                        }
                                                        setSearchText={e =>
                                                            handleChangeText(
                                                                e,
                                                                key
                                                            )
                                                        }
                                                        searchText={item.name}
                                                        quickOrder={true}
                                                        placeholder={formatMessage(
                                                            {
                                                                id:
                                                                    'quickOrder.SearchProduct',
                                                                defaultMessage:
                                                                    'Enter SKU or name of product'
                                                            }
                                                        )}
                                                        value={item.name}
                                                    />
                                                </div>
                                                {quantitySelector(item, key)}
                                                <div
                                                    className={
                                                        classes.priceWrapper
                                                    }
                                                >
                                                    {item.price ? (
                                                        <span
                                                            className={
                                                                classes.priceText
                                                            }
                                                        >
                                                            {' '}
                                                            {item.price
                                                                .regularPrice
                                                                .amount
                                                                .currency ===
                                                            'USD'
                                                                ? '$'
                                                                : '€'}
                                                            {(
                                                                item.price
                                                                    .regularPrice
                                                                    .amount
                                                                    .value *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={
                                                                classes.spanUnAailable
                                                            }
                                                        >
                                                            {' '}
                                                            <FormattedMessage
                                                                id={
                                                                    'quickOrder.Unavailable'
                                                                }
                                                                defaultMessage={
                                                                    'Unavailable'
                                                                }
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                                {key === products.length - 1 ? (
                                                    <div
                                                        className={
                                                            classes.addbtn
                                                        }
                                                    >
                                                        <Button
                                                            className={
                                                                classes.downloadBtn
                                                            }
                                                            onClick={addProduct}
                                                        >
                                                            <Icon
                                                                src={PlusCircle}
                                                                alt="download-icon"
                                                            />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={
                                                            classes.addbtn
                                                        }
                                                    >
                                                        <Button
                                                            onClick={() =>
                                                                removeProduct(
                                                                    key
                                                                )
                                                            }
                                                            className={`${
                                                                classes.downloadBtn
                                                            } ${
                                                                classes.removeIcon
                                                            }`}
                                                        >
                                                            <Icon
                                                                src={XCircle}
                                                            />
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
                                            defaultMessage="Here you can upload own file XLS, XLSX or CSV and products to cart."
                                        />
                                    </p>
                                    <div>
                                        <Button
                                            type="button"
                                            priority="high"
                                            onClick={handleCSVFile}
                                        >
                                            <FormattedMessage
                                                id="quickOrder.UploadYourFile"
                                                defaultMessage="Upload your file"
                                            />
                                        </Button>
                                    </div>
                                    <CSVLink data={csvData}>
                                        <Button className={classes.downloadBtn}>
                                            <Icon
                                                src={Download}
                                                alt="download-icon"
                                            />
                                            <FormattedMessage
                                                id="quickOrder.DownloadYourSampleFile"
                                                defaultMessage="Download your sample file"
                                            />
                                        </Button>
                                    </CSVLink>
                                </div>
                            </div>
                        </div>
                        <div className={classes.btnContainer}>
                            <div>
                                <Button
                                    type="button"
                                    priority="high"
                                    onClick={addToCartClick}
                                >
                                    <FormattedMessage
                                        id="quickOrder.AddToCart"
                                        defaultMessage="Add to cart"
                                    />
                                    <Icon
                                        className={classes.addCartIcon}
                                        src={ArrowDown}
                                        alt="arrowDown-icon"
                                    />
                                </Button>
                            </div>
                            <div>
                                <Button
                                    type="button"
                                    priority="high"
                                    onClick={addQuoteClick}
                                >
                                    <FormattedMessage
                                        id="quickOrder.GetQuote"
                                        defaultMessage="Get Quote"
                                    />
                                </Button>
                            </div>
                            <div>
                                <Button
                                    type="button"
                                    priority="high"
                                    onClick={createOrderClick}
                                >
                                    <FormattedMessage
                                        id="quickOrder.CreateOrder"
                                        defaultMessage="Create Order"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default AddQuickOrder;
