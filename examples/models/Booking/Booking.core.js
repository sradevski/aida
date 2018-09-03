const Booking = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  date: {
    vtype: 'datetime',
    faker: 'date.future',
  },
  description: {
    vtype: 'string',
    faker: 'lorem.sentences',
  },
  phoneNumber: {
    vtype: 'string',
    faker: 'phone.phoneNumberFormat',
  },
  numOfPeople: {
    vtype: 'byte',
    faker: [1, 2, 3, 4, 6, 8, 10],
  },
};

exports.default = Booking;
