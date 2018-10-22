
import { UserModel } from 'models/user.model';
import { TestCase } from 'testcases/test.case';

export const roniCost: TestCase<UserModel> = {
  expected: new UserModel('Veronica Costello', 'roni_cost@example.com', 'roni_cost3@example.com'),
};
