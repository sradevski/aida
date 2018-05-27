import BusinessAccountCore from '../BusinessAccount.core';
import Address from '../../Shared/intermediate/Address.core';

const BusinessAccount = {
  ...BusinessAccountCore,
  accountName: {
    vtype: 'string',
    faker: 'finance.accountName',
  },
  email: {
    vtype: 'string',
    faker: 'internet.email',
  },
  phoneNumber: {
    vtype: 'string',
    faker: 'phone.phoneNumber',
  },
  address: Address,
};

export default BusinessAccount;
