import { useCallback } from 'react';

import { useMutation } from '@apollo/client';

import Papa from 'papaparse';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { ADD_CONFIGURABLE_MUTATION, GET_PARENT_SKU, GET_PRODUCTS_BY_SKU } from './addProductByCsv.gql';

export const useAddProductsByCSV = props => {
    const { setCsvErrorType, setCsvSkuErrorList, setIsCsvDialogOpen, setProducts, success } = props;
    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(ADD_CONFIGURABLE_MUTATION);
    const getParentSku = useAwaitQuery(GET_PARENT_SKU);
    const getproduct = useAwaitQuery(GET_PRODUCTS_BY_SKU);

    const handleCSVFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = () => {
            const files = Array.from(input.files);

            if (files.length > 1) alert('Only 1 file is allowed');
            else if (files.length == 1) processCSVFile(files[0]);
        };
        input.click();
    };

    const processCSVFile = file => {
        if (file.name.split('.')[1] !== 'csv') {
            setCsvErrorType('format');
            setIsCsvDialogOpen(true);
        } else {
            Papa.parse(file, {
                complete: function(result) {
                    const dataValidated = formatData(result.data);
                    setProducts([]);
                    dataValidated.map(async item => {
                        const data = await getproduct({
                            variables: { sku: item[0] }
                        });
                        setProducts(prev => [
                            ...prev,
                            {
                                ...data?.data?.products?.items[0],
                                quantity: item[1]
                            }
                        ]);
                    });
                }
            });
        }
    };

    const formatData = rawData => {
        const dataValidated = [];
        for (let i = 1; i <= rawData.length - 1; i++) {
            if (
                rawData[i][0] != '' &&
                rawData[i][1] != '' &&
                parseInt(rawData[i][1], 10) >= 1 &&
                rawData[i].length == 2
            ) {
                // If SKU appear more than once, exclude it
                if (!dataValidated.map(e => e[0]).includes(rawData[i][0])) {
                    dataValidated.push(rawData[i]);
                }
            } else {
                setCsvErrorType('fields');
                setIsCsvDialogOpen(true);
            }
        }
        return dataValidated;
    };

    const handleAddProductsToCart = useCallback(
        async csvProducts => {
            const tempSkuErrorList = [];
            for (const element of csvProducts) {
                try {
                    const parentSkuResponse = await getParentSku({
                        variables: { sku: element[0] }
                    });

                    const variables = {
                        cartId,
                        quantity: parseInt(element[1], 10),
                        sku: element[0],
                        parentSku: parentSkuResponse.data.products.items[0].orParentSku
                    };
                    await addConfigurableProductToCart({
                        variables
                    });
                    success();
                } catch {
                    tempSkuErrorList.push(element[0]);
                    setCsvErrorType('loading');
                    setIsCsvDialogOpen(true);
                }
            }
            if (tempSkuErrorList.length > 0) {
                setCsvErrorType('sku');

                setCsvSkuErrorList(tempSkuErrorList);
            }
        },
        [
            addConfigurableProductToCart,
            cartId,
            setIsCsvDialogOpen,
            setCsvErrorType,
            setCsvSkuErrorList,
            getParentSku,
            success
        ]
    );

    return {
        handleCSVFile,
        handleAddProductsToCart
    };
};
