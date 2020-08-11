import React from 'react';
import './App.css';
import { Router } from '@reach/router';

import Context from './components/utilities/MainContext';
import Dashboard from './components/dashboard/Dashboard';
import TicketForm from './components/dashboard/ticket/TicketForm';
import TicketsDashboard from './components/dashboard/ticket/TicketsDashboard';
import ProjectForm from './components/dashboard/project/ProjectForm';
import Changelog from './components/utilities/Changelog';
import NotFound from './components/utilities/NotFound';

function App() {
    const settings = {
        PROJECT_API: process.env.REACT_APP_PROJECTS_API_LINK,
        TICKET_API: process.env.REACT_APP_TICKETS_API_LINK,
        statuses: {
            0: {
                name: "Backlog",
                alias: "backlog"
            },
            1: {
                name: "In Progress",
                alias: "in-progress"
            },
            777: {
                name: "Completed",
                alias: "completed"
            }
        }
    }
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
                <TicketsDashboard path="project/:name/tickets" />
                <TicketForm path="project/:name/tickets/new" action="create" />
                <TicketForm path="project/:name/tickets/:id/edit" action="edit" />
                <ProjectForm path="projects/new" action="create" />
                <ProjectForm path="projects/:id/edit" action="edit" />
                <Changelog path="changelog" />
                <NotFound default />
            </Router>

        </div>
    );
}

export default App;
