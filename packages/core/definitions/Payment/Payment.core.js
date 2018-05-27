const Payment = {
  paymentId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  businessAccountId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  paymentOption: {},
};

//   paymentInfo: [
//     {
//       lastFourDigits: 4235,
//       creditCardCompany: 'Visa',
//       expirationDate: '2018-06-05',
//     },
//   ],

export default Payment;
