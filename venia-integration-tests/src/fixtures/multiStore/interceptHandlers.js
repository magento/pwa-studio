import {
    accessoriesPathname,
    defaultStore,
    secondStore,
    subcategoryAPathname
} from '.';

const DATA_DIRECTORY = 'multiStore/data';

export const secondStoreViewOneHome = req => {
    const url = new URL(req.headers.referer);
    expect(url.pathname).to.equal('/');
    expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
    req.reply({
        fixture: `${DATA_DIRECTORY}/homeRoute.json`
    });
};

export const getCartData = (items, expectedStoreCode) => {
    return req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        switch (items) {
            case 1:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-1.json`
                });
                break;
            case 2:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-2.json`
                });
                break;
            case 3:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-3.json`
                });
                break;
        }
    };
};

export const homeRouteData = expectedStoreCode => {
    return req => {
        const url = new URL(req.headers.referer);
        expect(url.pathname).to.equal('/');
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/homeRoute.json`
        });
    };
};

export const accessoriesRouteData = expectedStoreCode => {
    return req => {
        const url = new URL(req.headers.referer);
        expect(url.pathname).to.equal(accessoriesPathname);
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/accessoriesRoute.json`
        });
    };
};

export const subcategoryARouteData = expectedStoreCode => {
    return req => {
        const url = new URL(req.headers.referer);
        expect(url.pathname).to.equal(subcategoryAPathname);
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/storeB/subcategoryARoute.json`
        });
    };
};
