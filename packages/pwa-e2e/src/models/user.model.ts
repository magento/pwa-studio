import { Model } from './model';
export class UserModel implements Model<UserModel> {
  public constructor(
    public username: string,
    public email: string,
    public password: string
  ) { }
}
