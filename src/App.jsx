import React from 'react';
import EventManagement from './components/EventManagement';
import AttendeeManagement from './components/AttendeeManagement';
import TaskTracker from './components/TaskTracker';
import './App.css';

function App() {
    return (
        <div className="App">
            <header>
                <h1>Event Management Dashboard</h1>
            </header>
            <section>
                <EventManagement />
                <AttendeeManagement />
                <TaskTracker />
            </section>
        </div>
    );
}

export default App;