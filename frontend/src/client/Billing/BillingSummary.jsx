import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import './billing.css'; 


// Add 'parking_name' to props validation
BillingSummary.propTypes = {
    plate: PropTypes.string.isRequired,
    parking: PropTypes.string.isRequired,
    timestamp_in: PropTypes.string.isRequired,
    timestamp_out: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};


export default function BillingSummary({plate, parking, timestamp_in, duration, amount, onClick}) {
    const dateTimeIn = DateTime.fromJSDate(new Date(timestamp_in)).setLocale('fr'); //=> '2014 août 06'

    return (
        <div className="billingSummary" onClick={onClick({plate:[plate], idBill:[parking]})}>
            <ul className='data'>
                <li>{ dateTimeIn.toFormat('dd LLL yyyy') }</li>
                <li>{ dateTimeIn.toFormat('hh:mm') }</li>
                <li>{ parking }</li>
                <li>{ parseInt(duration/60) + "h " + duration%60 + "m" }</li>
                <li>{ amount + "CHF" }</li>
            </ul>
        </div>
    );
}