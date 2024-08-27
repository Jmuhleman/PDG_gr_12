import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import './billing.css'; 


// Add 'parking_name' to props validation
BillingSummary.propTypes = {
    parking_name: PropTypes.string.isRequired,
    timestamp_in: PropTypes.string.isRequired,
    timestamp_out: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired
};


export default function BillingSummary({parking_name, timestamp_in, duration, amount }) {
    const dateTimeIn = DateTime.fromJSDate(new Date(timestamp_in)).setLocale('fr'); //=> '2014 août 06'

    return (
        <div className="billingSummary">
            <ul className='data'>
                <li>{ dateTimeIn.toFormat('dd LLL yyyy') }</li>
                <li>{ dateTimeIn.toFormat('hh:mm') }</li>
                <li>{ parking_name }</li>
                <li>{ parseInt(duration/60) + "h " + duration%60 + "m" }</li>
                <li>{ amount + "CHF" }</li>
            </ul>
        </div>
    );
}