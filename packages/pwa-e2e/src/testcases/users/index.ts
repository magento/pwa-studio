import { address, internet, name, phone as fakerPhone } from 'faker';

import { UserInformation } from 'models/user-information.model';

export const fakeUserInfo: UserInformation = {
  firstName: name.firstName(),
  lastName: name.lastName(),
  street: address.streetName(),
  city: address.city(),
  zip: address.zipCode(),
  state: address.state(),
  phone: fakerPhone.phoneNumber(),
  email: internet.email(),
};