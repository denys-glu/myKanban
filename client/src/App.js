import React from 'react';
import './App.css';
import { Router } from '@reach/router';
import Dashboard from './components/dashboard/Dashboard';
import TicketForm from './components/dashboard/TicketForm';

function App() {
    return (
        <div className="App">

            <div className="container mt-4">
                <div className="row">
                    <div className="col title-head">
                        <h1>Project Manager - <small>under development</small></h1>
                    </div>
                </div>
            </div>
            <Router>
                <Dashboard path="/" />
                <TicketForm path="tickets/new" action="create" />
                <TicketForm path="tickets/:id/edit" action="edit" />
                
            </Router>
        </div>
    );
}

export default App;
