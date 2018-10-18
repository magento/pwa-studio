import { UserModel } from 'models/user.model';
import { TestCase } from '../test.case';

export const defaultUser: TestCase<UserModel> = {
  expected: new UserModel('1', 'test@example.com', 'admin'),
};
