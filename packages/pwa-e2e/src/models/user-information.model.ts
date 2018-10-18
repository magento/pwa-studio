import { Model } from './model';

export interface UserInformation extends Model<UserInformation> {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  phone: string;
  email: string;
}