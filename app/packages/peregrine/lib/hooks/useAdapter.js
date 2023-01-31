import { useApolloClient } from '@apollo/client';
import { Magento2 } from '../RestApi';

import {getResolver} from '@b2bstore/boilerplate-adapter';

    const Client = boilerplate.Client.getInstance();
    Client.setFetcher('')

    const boilerplate = getResolver(Client);

export const useAdapter = () => {
    /*
        {
            getProducts,
            getProductById
        }
    */

    return {
        ...boilerplate
    };
};

// Hook
const { getProducts } = useAdapter();
getProducts()

const potencia = (a,b) => a**b

generadorPotencia = a => b => b**a
generadorPotencia(3)(4)
// currificar
console.log(generadorPotencia(3)) // f

const cuadrado = generdorPotencia(2);
cuadrado(4)
cuadrado(5)


// VISTA -> HOOK -> ADAPTER -> LIBRERIA


// Libreria
const getProducts = (Client) => () => {
    // const Client = boilerplate.Client.getInstance();
    let fetcher = Client.getFetcher()

    fetcher.getProducts

    return DataTransfer
}

const getProductById = (Client) => (id) => {
    // const Client = boilerplate.Client.getInstance();
    let fetcher = Client.getFetcher()

    fetcher.getProducts(id)

    return DataTransfer
}


const getResolver = (Client) => {
    return {
        getProducts: getProducts(Client),
        getProductById: getProducts(Client)
    }
}