import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import axios from 'axios';
import Project from './Project';

function Dashboard(props) {
    const [projects, setProjects] = useState([])

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);


    useEffect(() => {
        getProjects();
    }, [])

    function getProjects() {
        axios.get('http://localhost:8001/api/projects/all')
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
        axios.delete(`http://localhost:8001/api/projects/delete/${project._id}`, { id: project._id })
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

        axios.put(`http://localhost:8001/api/projects/update/${project._id}`, project)
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