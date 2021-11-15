/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// import Stripe from 'stripe';

 

export const bookTour = async tourId => {
  const stripe = Stripe('pk_test_51JuzsSSBm3IKlhzND4MmbuzH60jNtPWWMsIlK3gbYhpolL3hycUJncnuSURVeuzBzBqTwiLkqyAPgM7BfME9VmN100a6dudu6D');
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
