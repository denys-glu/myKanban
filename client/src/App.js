import React from 'react';
import './App.css';
import { Router } from '@reach/router';
import Dashboard from './components/dashboard/Dashboard';
import AddProjectForm from './components/dashboard/AddProjectForm';

function App() {
    return (
        <div className="App">


            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <h1>Project Manager</h1>
                    </div>
                </div>
            </div>
            <Router>
                <Dashboard path="/" />
                <AddProjectForm path="projects/new" />
            </Router>
        </div>
    );
}

export default App;
