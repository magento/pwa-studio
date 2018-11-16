import { internet } from 'faker/locale/en';

export class UserModel {
  public constructor(
    public readonly username: string = internet.userName(),
    public readonly password: string = internet.password(),
    public readonly email: string = internet.exampleEmail(username)
  ) { }
}
