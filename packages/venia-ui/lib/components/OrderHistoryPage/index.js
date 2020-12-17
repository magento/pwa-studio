import React from 'react';
import { Form } from 'informed';
import OrderHistoryPage from './orderHistoryPage';

export default props => (
    <Form>
        <OrderHistoryPage {...props} />
    </Form>
);
