import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendeeManagement = () => {
    const [attendees, setAttendees] = useState([]);
    const [attendeeData, setAttendeeData] = useState({ name: '' });

    useEffect(() => {
        fetchAttendees();
    }, []);

    const fetchAttendees = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/attendees', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token if using JWT
            });
            setAttendees(response.data);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        }
    };

    const handleChange = (e) => {
        setAttendeeData({ ...attendeeData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/attendees', attendeeData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token if using JWT
            });
            fetchAttendees();
            setAttendeeData({ name: '' });
        } catch (error) {
            console.error('Error adding attendee:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2>Attendee Management</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Attendee Name" value={attendeeData.name} onChange={handleChange} required />
                <button type="submit">Add Attendee</button>
            </form>
            <ul>
                {attendees.map(attendee => (
                    <li key={attendee.id}>{attendee.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default AttendeeManagement;