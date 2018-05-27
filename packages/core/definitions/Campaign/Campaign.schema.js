import CampaignCore from './Campaign.core';
import Audience from '../Shared/intermediate/Audience.core';

const Campaigns = {
  ...CampaignCore,
  name: {
    vtype: 'string',
    required: true,
    faker: 'name.findName',
  },
  audience: Audience,
  budget: {
    vtype: 'double',
    faker: 'random.number',
  },
  isActive: {
    vtype: 'boolean',
    faker: 'random.boolean',
  },
  timing: {
    from: {
      vtype: 'integer',
      faker: {
        faker: 'random.number',
        options: {
          min: 1497707887000,
          max: 1507707887000,
        },
      },
    },
    to: {
      vtype: 'integer',
      faker: {
        faker: 'random.number',
        options: {
          min: 1577707887000,
          max: 1597707887000,
        },
      },
    },
  },
};
export default Campaigns;
