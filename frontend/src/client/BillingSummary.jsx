import React from 'react';
import PropTypes from 'prop-types';

// Add 'parking_name' to props validation
BillingSummary.propTypes = {
    parking_name: PropTypes.string.isRequired,
    plate_number: PropTypes.string.isRequired,
    timestamp_in: PropTypes.string.isRequired,
    timestamp_out: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired
};

export default function BillingSummary({parking_name, timestamp_in, timestamp_out, duration, amount }) {
    return (
        <div className="BillingSummary">
            <ul>
                <li>{ "Date : " }</li>
                <li>{ "Heure : " }</li>
                <li>{ "Parking : " }</li>
                <li>{ "Durée : " }</li>
                <li>{ "Prix : " }</li>
            </ul>
            <ul>
                <li>{ new Date(timestamp_in).toDateString() }</li>
                <li>{ new Date(timestamp_out).toLocaleTimeString() }</li>
                <li>{ parking_name }</li>
                <li>{ duration }</li>
                <li>{ amount }</li>
            </ul>
        </div>
    );
}