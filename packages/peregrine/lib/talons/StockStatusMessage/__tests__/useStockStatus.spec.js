import { renderHook } from '@testing-library/react-hooks';

import { IN_STOCK, LOW_STOCK, OUT_OF_STOCK } from '../constants';
import { useStockStatus } from '../useStockStatus';

describe('#useStockStatus', () => {
    it('returns simple product in stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'SimpleProduct',
                    only_x_left_in_stock: null,
                    stock_status: IN_STOCK
                }
            }
        });

        expect(result.current.stockStatus).toEqual(IN_STOCK);
    });

    it('returns simple product low in stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'SimpleProduct',
                    only_x_left_in_stock: 5,
                    stock_status: IN_STOCK
                }
            }
        });

        expect(result.current.stockStatus).toEqual(LOW_STOCK);
    });

    it('returns simple product out of stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'SimpleProduct',
                    only_x_left_in_stock: null,
                    stock_status: OUT_OF_STOCK
                }
            }
        });

        expect(result.current.stockStatus).toEqual(OUT_OF_STOCK);
    });

    it('returns configurable product in stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'ConfigurableProduct',
                    only_x_left_in_stock: null,
                    stock_status: IN_STOCK,
                    variants: [
                        {
                            product: {
                                only_x_left_in_stock: null,
                                stock_status: IN_STOCK
                            }
                        }
                    ]
                }
            }
        });

        expect(result.current.stockStatus).toEqual(IN_STOCK);
    });

    it('returns configurable product where option is low in stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'ConfigurableProduct',
                    only_x_left_in_stock: null,
                    stock_status: IN_STOCK,
                    variants: [
                        {
                            product: {
                                only_x_left_in_stock: 5,
                                stock_status: IN_STOCK
                            }
                        }
                    ]
                }
            }
        });

        expect(result.current.stockStatus).toEqual(LOW_STOCK);
    });

    it('returns configurable product where option is out of stock', () => {
        const { result } = renderHook(useStockStatus, {
            initialProps: {
                item: {
                    __typename: 'ConfigurableProduct',
                    only_x_left_in_stock: null,
                    stock_status: IN_STOCK,
                    variants: [
                        {
                            product: {
                                only_x_left_in_stock: null,
                                stock_status: OUT_OF_STOCK
                            }
                        }
                    ]
                }
            }
        });

        expect(result.current.stockStatus).toEqual(LOW_STOCK);
    });
});
