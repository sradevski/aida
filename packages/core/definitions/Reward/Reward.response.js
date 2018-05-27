import RewardCore from './Reward.core';
import BusinessAccountCore from '../BusinessAccount/BusinessAccount.core';

const Reward = {
  ...RewardCore,
  business: {
    logo: BusinessAccountCore.logo,
    name: BusinessAccountCore.name,
  },
};

export default Reward;
