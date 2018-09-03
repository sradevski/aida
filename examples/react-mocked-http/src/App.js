import React, { Component } from 'react';

class App extends Component {
  //State and requests can come from Redux, but we will do it in the component for demonstration purposes.
  state = {
    bookings: [],
    booking: {},
  };

  componentDidMount() {
    this.setState({ isFetchingBookings: true });
    fetch('http://localhost:4000/bookings').then(data =>
      this.setState({ bookings: JSON.parse(data) }).catch(
        err => err /*Let's ignore errors for now*/,
      ),
    );
  }

  getBookingDetails() {
    //fetch('bookingwithid')
  }

  render() {
    const { bookings, booking } = this.state;

    return (
      <div style={{ margin: 50 }}>
        <header>
          <h1>Welcome to React</h1>
        </header>

        {bookings.length <= 0 ? (
          <p>Spinner</p>
        ) : (
          bookings.map(booking => {
            return (
              <div style={{ marginTop: 20 }}>
                <h2>{booking.id}</h2>
                <h2>{booking.date}</h2>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default App;
