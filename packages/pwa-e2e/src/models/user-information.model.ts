import { address, internet, name, phone as _phone } from 'faker/locale/en_US';

import { Model } from './model';

export class UserInformation implements Model<UserInformation> {
  public constructor(
    public readonly firstName: string = name.firstName(),
    public readonly lastName: string = name.lastName(),
    public readonly street: string = address.streetAddress(),
    public readonly city: string = address.city(),
    public readonly zip: string = address.zipCode(),
    public readonly state: string = address.state(),
    public readonly phone: string = _phone.phoneNumber(),
    public readonly email: string = internet.exampleEmail()
  ) { }
}

export function isUserInformation(modelLike: any): modelLike is UserInformation {
  return (
    modelLike.firstName &&
    modelLike.lastName &&
    modelLike.street &&
    modelLike.city &&
    modelLike.zip &&
    modelLike.state &&
    modelLike.phone &&
    modelLike.email
  );
}