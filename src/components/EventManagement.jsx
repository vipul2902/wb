import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [eventData, setEventData] = useState({ name: '', description: '', location: '', date: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/events', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/events', eventData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token
            });
            fetchEvents();
            setEventData({ name: '', description: '', location: '', date: '' });
        } catch (error) {
            console.error('Error adding event:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2>Event Management</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Event Name" value={eventData.name} onChange={handleChange} required />
                <input name="description" placeholder="Description" value={eventData.description} onChange={handleChange} required />
                <input name="location" placeholder="Location" value={eventData.location} onChange={handleChange} required />
                <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
                <button type="submit">Add Event</button>
            </form>
            <ul>
                {events.map(event => (
                    <li key={event.id}>{event.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default EventManagement;