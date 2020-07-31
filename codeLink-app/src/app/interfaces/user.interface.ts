export interface User {
  _id?: string;
  name?: string;
  email?: string;
  pre: boolean;
  img?: string;
  status?: boolean;
  plan?: string,
  creditCard?: Object,
  paymentMethod: boolean
}
