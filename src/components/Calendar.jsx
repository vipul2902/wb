import React from 'react';
import Calendar from 'react-calendar';

const EventCalendar = ({ events }) => {
    return (
        <div>
            <h2>Event Calendar</h2>
            <Calendar />
            {/* You can add logic to display events on specific dates */}
        </div>
    );
};

export default EventCalendar;