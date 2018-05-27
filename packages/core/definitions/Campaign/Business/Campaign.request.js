import CampaignCore from '../Campaign.core';
import Audience from '../../Shared/intermediate/Audience.core';

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
      faker: 'random.number',
    },
    to: {
      vtype: 'integer',
      faker: 'random.number',
    },
  },
};
export default Campaigns;
