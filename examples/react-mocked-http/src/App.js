import React, { Component } from 'react';
import getRoute from './routesMapper';

class App extends Component {
  //State and requests can be handled with Redux or something else, but we will do it in the component for demonstration purposes.
  state = {
    bookings: [],
    booking: null,
    fetching: false,
  };

  // You do requests normally, there is no need to change anything to mock them. The best thing is, you don't need to run a server to mock it, it is automatically controlled using the NODE_ENV variable.
  componentDidMount() {
    this.setState({ fetching: true });
    fetch(getRoute('getBookings'))
      .then(data => data.json())
      .then(jsonData => this.setState({ bookings: jsonData, fetching: false }))
      .catch(err => err /*Let's ignore errors for now*/);
  }

  getBookingDetails(id) {
    this.setState({ fetching: true, booking: null });
    //We can use the operationId from the .endpoints model to refer to routes, so we don't have to worry about base routes, changing urls, and applying path parameters correctly.
    fetch(getRoute('getBooking', { id }))
      .then(data => data.json())
      .then(jsonData => this.setState({ booking: jsonData, fetching: false }));
  }

  //The render is standard React, nothing special going on there.
  render() {
    const { bookings, booking, fetching } = this.state;

    return (
      <div style={bodyStyle}>
        <header>
          <h1>Your Bookings</h1>
        </header>

        {fetching && <strong>Loading...</strong>}

        {booking && (
          <div style={bookingDetailsStyle}>
            <h2>{booking.name}</h2>
            <h3>{new Date(booking.date).toLocaleString()}</h3>
            <h4>{booking.description}</h4>
            <h4>For {booking.numOfPeople} people</h4>
          </div>
        )}

        <div style={bookingSectionStyle}>
          {bookings.map(booking => {
            return (
              <div
                key={booking.id}
                onClick={() => this.getBookingDetails(booking.id)}
                style={bookingStyle}
              >
                <h2>{booking.name}</h2>
                <h3>{new Date(booking.date).toLocaleString()}</h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const bodyStyle = {
  margin: '5%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const bookingSectionStyle = {
  marginTop: 50,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const bookingStyle = {
  margin: 20,
  width: 400,
  borderStyle: 'solid',
  padding: 10,
  cursor: 'pointer',
};

const bookingDetailsStyle = {
  margin: 20,
  width: '80%',
  borderStyle: 'dashed',
  padding: 10,
  cursor: 'pointer',
};

export default App;
