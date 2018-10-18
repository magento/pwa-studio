import { UserModel } from '../models/user.model';
import { TestCase } from './test.case';

export const UserTestCase1: TestCase<UserModel> = {
  expected: new UserModel('1', 'test@example.com', 'admin'),
};
