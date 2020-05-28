import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import axios from 'axios';
import Project from './Project';
import io from 'socket.io-client';

function Dashboard(props) {
    const [, setProjects] = useState([])
    const [socket] = useState(() => io(':8000'));

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

    useEffect(() => {
        // we need to set up all of our event listeners
        // in the useEffect callback function
        console.log('Is this running?');
        socket.on('all projects', saveAndSortProjects);

        socket.on('update project response', (res) => {
            console.log("update received", res)
        });
        // note that we're returning a callback function
        // this ensures that the underlying socket will be closed if App is unmounted
        // this would be more critical if we were creating the socket in a subcomponent
        return () => socket.disconnect(true);

    }, []);

    function saveAndSortProjects({ data }) {
        console.log("saveAndSortProjects -> data", data)
        setInProgress(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "In Progress"))

        setBacklog(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "Backlog"))

        setCompleted(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "Completed"))

        setProjects(data)
    }

    function deleteProject(project) {
        socket.emit("delete project", project)
    }

    function projectStatusHandler(project, newStatus) {

        // if (project.status === "Completed") {
        //     deleteProject(project);
        //     return true;
        // }
        switch (project.status) {
            case "Backlog":
                project.status = "In Progress"
                break;
            case "In Progress":
                project.status = "Completed"
                break;
            case "Completed":
                project.status = "Backlog"
                break;
            default:
                console.log("some unknown status received")
        }
        socket.emit('update project', project);
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-4">
                        <h2 className="text-primary border">Backlog</h2>
                        <div className="projects border">
                            {
                                backlog.map((project, i) => <Project key={i} project={project} callback={projectStatusHandler} />)
                            }
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <h2 className="text-warning border">In Progress</h2>
                        <div className="projects border">
                            {
                                inProgress.map((project, i) => <Project key={i} project={project} callback={projectStatusHandler} />)
                            }
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <h2 className="text-success border">Completed</h2>
                        <div className="projects border">
                            {
                                completed.map((project, i) => <Project key={i} project={project} callback={projectStatusHandler} />)
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-left p-3">
                        <Link className="btn btn-primary" to="projects/new">
                            <div className="plus radius mr-2"></div>
                            Add New Project
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;