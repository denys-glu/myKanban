import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

// Components
import Dashboard from './components/dashboard/Dashboard';
import TicketForm from './components/dashboard/ticket/TicketForm';
import TicketsDashboard from './components/dashboard/ticket/TicketsDashboard';
import ProjectForm from './components/dashboard/project/ProjectForm';

// Utilities
import Changelog from './components/utilities/Changelog';
import NotFound from './components/utilities/NotFound';
import Storage from './components/utilities/Storage';


function App() {
    const settings = {
        "PROJECT_API": process.env.REACT_APP_PROJECTS_API_LINK,
        "TICKET_API": process.env.REACT_APP_TICKETS_API_LINK,
        "statuses": {
            "0": {
                "name": "Backlog",
                "alias": "backlog"
            },
            "1": {
                "name": "In Progress",
                "alias": "in-progress"
            },
            "777": {
                "name": "Completed",
                "alias": "completed"
            }
        }
    }
    Storage.save("settings", settings);
    return (
        <Router>

            <div className="App">

                <div className="container mt-4">
                    <div className="row">
                        <div className="col title-head">
                            <h1>Project Manager - <small>under development</small></h1>
                        </div>
                    </div>
                </div>

                <Switch>
                    <Route exact path="/" component={ Dashboard } />

                    <Route exact path="/project/:name/tickets" 
                            component={ TicketsDashboard } />

                    <Route path="/project/:name/tickets/new" 
                            component={() => <TicketForm /> } />

                    <Route path="/project/:name/tickets/:id/edit" 
                            component={() => <TicketForm action="edit" /> } />

                    <Route path="/projects/new" 
                            component={() => <ProjectForm action="create" /> } />

                    <Route path="/projects/:id/edit" 
                        component={() => <ProjectForm action="edit" /> } />

                    <Route path="/changelog" component={ <Changelog /> } />

                    <Route path="*" component={ <NotFound /> } />

                </Switch>

            </div>
        </Router>
    );
}

export default App;
