import CampaignCore from '../Campaign.core';
import BusinessAccountCore from '../../BusinessAccount/BusinessAccount.core';
const Campaign = {
  ...CampaignCore,
  validUntil: {
    vtype: 'integer',
    faker: {
      faker: 'random.number',
      options: {
        min: 1547707887000,
        max: 1597707887000,
      },
    },
  },
  business: {
    logo: BusinessAccountCore.logo,
    name: BusinessAccountCore.name,
  },
};

export default Campaign;
