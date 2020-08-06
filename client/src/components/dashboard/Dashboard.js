import React, { useState, useEffect, useContext } from 'react'
import { Link, navigate } from '@reach/router';

import Context from '../utilities/MainContext';
import TicketDashboard from './ticket/TicketsDashboard'
import axios from 'axios';

const Dashboard = () => {
    const [projects, setProjects] = useState();
    const [loaded, setLoaded] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const PROJECT_API = useContext(Context).PROJECT_API;
    useContext(Context).projects = projects;

    useEffect(() => {
        axios.get(`${PROJECT_API}`)
            .then(res => {
                if (res.data.message === "Success") {
                    console.log(res.data.results)
                    setProjects(res.data.results)
                    setLoaded(true)
                }
            })
    }, [])

    const goToProject = () => {
        
        navigate(`tickets/${selectedProject}`)
    }
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h3>Choose a project to work with:</h3>
                        <select name="project" className="form-control" onChange={e => setSelectedProject(e.target.value)}>
                            <option value="">----</option>
                            {
                                loaded && projects.map((project, idx) => (
                                    <option key={idx} value={project._id}> {project.name}</option>
                                ))
                            }
                        </select>
                        <button className="btn btn-success btn-block mt-3" onClick={ goToProject }>
                            Select
                        </button>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <Link className="btn fs32 btn-primary p-3" to="projects/new">Add new project</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
