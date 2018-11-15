// TODO: (vitali) implement payWith and getItBy fields whe prod will be ready
export interface CheckoutModel {
  shipTo: ShippingInformation;
  payWith?: PaymentInformation;
  getItBy?: any;
}

export interface ShippingInformation {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zip: number | string;
  state: string;
  phone: string;
  email: string;
}

export interface PaymentInformation { }
