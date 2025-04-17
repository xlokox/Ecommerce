import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

// Load Stripe outside of component render to avoid recreating the Stripe object on every render
const stripePromise = loadStripe('pk_test_51Oml5cGAwoXiNtjJgPPyQngDj9WTjawya4zCsqTn3LPFhl4VvLZZJIh9fW9wqVweFYC5f0YEb9zjUqRpXbkEKT7T00eU1xQvjp')

// Add a comment to explain the HTTP warning
// Note: The warning "You may test your Stripe.js integration over HTTP" is expected in development
// In production, you should use HTTPS

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')
    const appearance = {
        theme: 'stripe'
    }
    const options = {
        appearance,
        clientSecret
    }

    const create_payment = async () => {
        try {
            const { data } = await axios.post('http://localhost:5001/api/order/create-payment',{price},{withCredentials:true})
            setClientSecret(data.clientSecret)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white'>Start Payment</button>
            }
        </div>
    );
};

export default Stripe;