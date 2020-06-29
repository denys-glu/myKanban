import React from 'react';
import './App.css';
import { Router } from '@reach/router';
import Dashboard from './components/dashboard/Dashboard';
import AddTicketForm from './components/dashboard/AddTicketForm';

function App() {
    return (
        <div className="App">

            <div className="container mt-4">
                <div className="row">
                    <div className="col title-head">
                        <h1>Project Manager</h1>
                    </div>
                </div>
            </div>
            <Router>
                <Dashboard path="/" />
                <AddTicketForm path="tickets/new" />
            </Router>
        </div>
    );
}

export default App;
