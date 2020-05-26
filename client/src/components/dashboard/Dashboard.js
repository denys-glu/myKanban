import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import axios from 'axios';
import Project from './Project';
import io from 'socket.io-client';

function Dashboard(props) {
    const [, setProjects] = useState([])
    const [socket] = useState(() => io(':8000/api/projects/all'));

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

    useEffect(() => {
        // getProjects();
    }, [])


    useEffect(() => {
        // we need to set up all of our event listeners
        // in the useEffect callback function
        console.log('Is this running?');
        socket.on('all projects', data => {
            socket.emit('my other event', { my: 'data' });
            console.log(data)
            // console.log(JSON.parse(data))
        });

        // note that we're returning a callback function
        // this ensures that the underlying socket will be closed if App is unmounted
        // this would be more critical if we were creating the socket in a subcomponent
        return () => socket.disconnect(true);

    }, []);

    function getProjects() {
        axios.get('http://localhost:8000/api/projects/all')
            .then(res => {
                setInProgress(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "In Progress"))

                setBacklog(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "Backlog"))

                setCompleted(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "Completed"))

                setProjects(res.data.allProjects)
            })
    }

    function deleteProject(project) {
        axios.delete(`http://localhost:8000/api/projects/delete/${project._id}`, { id: project._id })
            .then(res => {
                console.log("Successfuly deleted a project: ", res)
                getProjects();
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function projectStatusHandler(project) {
        if (project.status === "Completed") {
            deleteProject(project);
            return true;
        }
        switch (project.status) {
            case "Backlog":
                project.status = "In Progress"
                break;
            case "In Progress":
                project.status = "Completed"
                break;
            default:
                console.log("some unknown status received")
        }

        axios.put(`http://localhost:8000/api/projects/update/${project._id}`, project)
            .then(res => {
                console.log("project successfully updated: ", res)
                getProjects();
            })
            .catch(err => console.log("Error happend while updatin project: ", err))
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