import { internet } from 'faker/locale/en_US';
import { Model } from './model';

export class UserModel implements Model<UserModel> {
  public constructor(
    public readonly username: string = internet.userName(),
    public readonly email: string = internet.exampleEmail(),
    public readonly password: string = internet.password()
  ) { }
}

export function isUserModel(modelLike: any): modelLike is UserModel {
  return (modelLike.username && modelLike.email && modelLike.password) ? true : false;
}