import React from 'react';

import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';

const CusotmerAlertPage = () => {
    const { customersAlertsItems } = useProductsAlert();
    console.log({customersAlertsItems});

    return <div>CusotmerAlertPage</div>;
};

export default CusotmerAlertPage;
