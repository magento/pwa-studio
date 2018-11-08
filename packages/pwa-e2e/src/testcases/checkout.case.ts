import { address, internet, name, phone } from 'faker';

import { CheckoutModel, ShippingInformation } from 'models/checkout.model';

import { TestCase } from './test.case';

const firstName = name.firstName();
const lastName = name.lastName();

const shipTo: ShippingInformation = {
  firstName,
  lastName,
  city: address.city(),
  email: internet.exampleEmail(firstName, lastName),
  zip: address.zipCode(),
  street: address.streetAddress(),
  state: address.stateAbbr(),
  phone: phone.phoneNumber(),
};

export const checkoutCase: TestCase<CheckoutModel> = {
  expected: { shipTo },
};