import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';

import Storage from '../utilities/Storage';

import axios from 'axios';

const Dashboard = (props) => {
    const history = useHistory();
    const [projects, setProjects] = useState();
    const [loaded, setLoaded] = useState(false);
    const [selectedProject, setSelectedProject] = useState({});
    const [projectError, setProjectError] = useState({
        status: false,
        text: "Select valid project"
    })

    const PROJECT_API =  Storage.get("settings")["PROJECT_API"];
    
    useEffect(() => {
        axios.get(`${PROJECT_API}`)
            .then(res => {
                if (res.data.message === "Success") {
                    setProjects(res.data.results)
                    setLoaded(true)
                }
            })
    }, [])

    const goToProject = () => {
        // console.log(selectedProject)
        if(selectedProject.name) {
            const {name, _id: id} = selectedProject
            Storage.save("currentSession", {name, id})
            history.push(`project/${selectedProject.name}/tickets`, { state: {id:selectedProject._id }})
        } else {
            console.log("select an existing project")
            setProjectError({...projectError, status: true})
        }
    }

    const setProject = id => setSelectedProject(projects.filter(proj => proj._id === id)[0])

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <p className="fs40">Choose a project to work with:</p>
                        {
                            projectError.status && <p className="text-danger fs32" >{projectError.text}</p>
                        }
                        <select name="project" className="form-control" onChange={e => setProject(e.target.value)}>
                            <option value="">----</option>
                            {
                                loaded && projects.map((project, idx) => (
                                    <option key={idx} value={project._id}> {project.name}</option>
                                ))
                            }
                        </select>
                        <button className="btn btn-success btn-block mt-3 fs32" onClick={ goToProject }>
                            Select
                        </button>
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <Link className="btn btn-block fs32 btn-primary" to="projects/new">Add new project</Link>
                    </div>
                </div>
            </div>
            {props.children}
        </>
    )
}

export default Dashboard
