import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import Papa from 'papaparse';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { ADD_CONFIGURABLE_MUTATION, GET_PARENT_SKU } from '../query/addProductByCsv.gql';

export const useAddProductsByCSV = props => {
    const { setCsvErrorType, setCsvSkuErrorList, setIsCsvDialogOpen } = props;
    const [{ cartId }] = useCartContext();

    const [addConfigurableProductToCart] = useMutation(ADD_CONFIGURABLE_MUTATION);
    const getParentSku = useAwaitQuery(GET_PARENT_SKU);

    const handleCSVFile = () => {
        setCsvErrorType('');
        setCsvSkuErrorList([]);
        setIsCsvDialogOpen(false);

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
                    handleAddProductsToCart(dataValidated);
                }
            });
        }
    };

    const formatData = rawData => {
        const dataValidated = [];
        for (let i = 1; i < rawData.length - 1; i++) {
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
            for (let i = 0; i < csvProducts.length; i++) {
                try {
                    const parentSkuResponse = await getParentSku({
                        variables: { sku: csvProducts[i][0] }
                    });

                    const variables = {
                        cartId,
                        quantity: parseInt(csvProducts[i][1], 10),
                        sku: csvProducts[i][0],
                        parentSku: parentSkuResponse.data.products.items[0].orParentSku
                    };

                    await addConfigurableProductToCart({
                        variables
                    });
                } catch {
                    tempSkuErrorList.push(csvProducts[i][0]);
                    setCsvErrorType('loading');
                    setIsCsvDialogOpen(true);
                }
            }
            if (tempSkuErrorList.length > 0) {
                setCsvErrorType('sku');
                setCsvSkuErrorList(tempSkuErrorList);
            }
        },
        [addConfigurableProductToCart, cartId, setIsCsvDialogOpen, setCsvErrorType, setCsvSkuErrorList, getParentSku]
    );

    return {
        handleCSVFile,
        handleAddProductsToCart
    };
};
