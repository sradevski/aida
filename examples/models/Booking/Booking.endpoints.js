const BookingCore = require('./Booking.core.js').default;

const Booking = {
  '/booking': {
    get: {
      description: 'Get all bookings',
      operationId: 'getBookings',
      request: {},
      response: {
        '200': {
          description: 'Returns all bookings',
          body: [
            {
              id: BookingCore.id,
              date: BookingCore.date,
            },
            { numOfEntries: 10 },
          ],
        },
      },
    },
  },

  '/booking/{id}': {
    get: {
      description: 'Get a single booking',
      operationId: 'getBooking',
      request: {
        path: {
          id: BookingCore.id,
        },
      },
      response: {
        '200': {
          description: 'Returns the details for the specified booking',
          body: BookingCore,
        },
      },
    },
  },
};

exports.default = Booking;
