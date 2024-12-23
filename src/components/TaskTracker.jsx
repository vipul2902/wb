// src/components/TaskTracker.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Connect to the Socket.io server

const TaskTracker = () => {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({ name: '', deadline: '', status: 'Pending', eventId: '' });
    const [eventId, setEventId] = useState('');

    useEffect(() => {
        if (eventId) {
            fetchTasks(eventId);
        }
    }, [eventId]);

    useEffect(() => {
        // Listen for task updates from the server
        socket.on('taskUpdated', (updatedTask) => {
            setTasks((prevTasks) => {
                return prevTasks.map(task => 
                    task.id === updatedTask.id ? updatedTask : task
                );
            });
        });

        return () => {
            socket.off('taskUpdated'); // Clean up the listener on component unmount
        };
    }, []);

    const fetchTasks = async (eventId) => {
        const response = await axios.get(`http://localhost:5001/api/tasks/${eventId}`);
        setTasks(response.data);
    };

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5001/api/tasks', { ...taskData, eventId });
        fetchTasks(eventId);
        setTaskData({ name: '', deadline: '', status: 'Pending', eventId: '' });

        // Emit the task update to the server
        socket.emit('taskUpdated', response.data);
    };

    const handleStatusChange = async (id) => {
        const task = tasks.find(t => t.id === id);
        const updatedTask = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
        await axios.put(`http://localhost:5001/api/tasks/${id}`, updatedTask);
        
        // Emit the updated task to the server
        socket.emit('taskUpdated', updatedTask);
        fetchTasks(eventId);
    };

    // Calculate completion percentage
    const completionPercentage = tasks.length > 0 
        ? (tasks.filter(task => task.status === 'Completed').length / tasks.length) * 100 
        : 0;

    return (
        <div>
            <h2>Task Tracker</h2>
            <select onChange={(e) => setEventId(e.target.value)}>
                <option value="">Select Event</option>
                {/* Populate with event options */}
            </select>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Task Name" value={taskData.name} onChange={handleChange} required />
                <input type="date" name="deadline" value={taskData.deadline} onChange={handleChange} required />
                <button type="submit">Add Task</button>
            </form>

            {/* Progress Bar */}
            <div style={{ width: '100%', backgroundColor: '#e0e0e0', margin: '20px 0' }}>
                <div style={{ width: `${completionPercentage}%`, backgroundColor: '#76c7c0', height: '20px' }} />
            </div>
            <p>{completionPercentage.toFixed(2)}% Completed</p>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.name} - {task.deadline} - {task.status}
                        <button onClick={() => handleStatusChange(task.id)}>Toggle Status</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskTracker;