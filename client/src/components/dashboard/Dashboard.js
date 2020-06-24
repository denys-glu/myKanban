import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import axios from 'axios';
import DnDWrapper from './DnDWrapper';

function Dashboard() {
    const [projects, setProjects] = useState([])
    const [loaded, setLoaded] = useState(false)

    const API_URL = `http://localhost:8000/api/projects/`;

    useEffect(() => {
        getProjects();
    }, [])

    function getProjects() {
        axios.get(API_URL + "all")
            .then(res => {
                // console.log("getProjects -> res.data", res.data)
                setProjects(res.data)
                setLoaded(true)
            })
            .catch(err => console.warn(err))
    }

    function deleteProject(project) {
        axios.delete(`${API_URL}delete/${project._id}`, { id: project._id })
            .then(res => {
                console.log("Successfuly deleted a project: ", res)
                getProjects();
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function projectStatusHandler(project, newStatus) {

        if (project.status === "2" && newStatus === undefined) {
            deleteProject(project);
            return;
        }

        project.status = newStatus;
        axios.put(`${API_URL}update/${project._id}`, project)
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
                    {loaded ?
                        <DnDWrapper projects={projects} 
                                    setProjects={setProjects} 
                                    projectStatusHandler={projectStatusHandler} />:
                    <p>Loading...</p>
                    }
                </div>
                <div className="row">
                    <div className="col text-left p-3">
                        <Link className="btn  fs32 btn-success" to="projects/new">
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