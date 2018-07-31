const Account = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  username: {
    vtype: 'string',
    faker: 'internet.userName',
  },
};

exports.default = Account;
