import { removeBlacklistedFields } from '../helpers';
import UserCore from './User.core';

const User = {
  ...UserCore,
};

const blacklist = ['id'];

export default removeBlacklistedFields(User, blacklist);
