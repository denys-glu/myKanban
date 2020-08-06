import React, { useState, useEffect, useContext } from 'react';
import { Link, navigate } from '@reach/router';
import axios from 'axios';

import Context from '../../utilities/MainContext';

function ProjectForm(props) {
    const { action } = props;
    const PROJECT_API = useContext(Context).PROJECT_API;

    const [project, setProject] = useState({
        name: "",
        dueDate: "",
        description: ""
    });
    // TODO: add dynamic validation
    const [errors, setErrors] = useState({
        name: "",
        dueDate: "",
        description: ""
    });

    useEffect(() => {
        if (action === "edit") {
            // console.log(props)
            axios.get(`${PROJECT_API}/${props.id}`)
                .then(response => {
                    if (response.data.message === "Success") {
                        setProject(response.data.results)
                    } else {
                        navigate("/")
                    }
                })
        }
    }, [])
    //TODO: there is another delete ticjketc function inside Dashboard, find way how to remove one of them
    function deleteTicket() {
        console.log(project)
        axios.delete(`${PROJECT_API}/delete/${project._id}`, { id: project._id })
            .then(res => {
                console.log("Successfuly deleted a project: ", res)
                navigate("/")
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function changeHandler(e) {
        const newTicket = {
            ...project,
            [e.target.name]: e.target.value
        }
        validate(newTicket)
        setProject(newTicket)
    }

    const validate = newTicket => {
        console.log(newTicket)
        let valid = false;
        const { ...curErrors } = errors;
        if (newTicket.name.length === 0) {
            curErrors.name = "This is a required field.";
        } else if (newTicket.name.length < 5) {
            curErrors.name = "project name must be at least 5 characters in length.";
        } else if (newTicket.name.length > 50) {
            curErrors.name = "project name should not be longer than 50 characters!";
        } else {
            curErrors.name = "";
            valid = true;
        }

        if (newTicket.description.length === 0) {
            curErrors.description = "This is a required field.";
        } else if (newTicket.description.length < 10) {
            curErrors.description = "project description must be at least 10 characters in length.";
        } else if (newTicket.description.length > 1000) {
            curErrors.description = "Description should not be longer than 1000 characters!";
        } else {
            curErrors.description = "";
            valid = true;
        }

        if (newTicket.dueDate.length === 0) {
            curErrors.dueDate = "This is a required field.";
        } else {
            curErrors.dueDate = "";
            valid = true;
        }

        setErrors(curErrors);

        return valid;
    }

    function submitHandler(e) {
        e.preventDefault();
        if (validate(project)) {
            if (action === "edit") {
                console.log(project)
                axios.patch(`${PROJECT_API}/update/${project._id}`, project)
                    .then(res => {
                        if (res.data.message === "Success") {
                            setProject(res.data.results)
                        } else {
                            navigate("/")
                        }
                    })
            } else {
                axios.post(`${PROJECT_API}/new`, project)
                    .then(res => {
                        navigate("/");
                    })
                    .catch(err => {
                        console.log("Error happend :(", err);
                        if (err.response.data.error.name === "MongoError") {
                            setErrors({ ...errors, name: `project name must be unique, "${err.response.data.error.keyValue.name}" has already been taken!` });
                        } else {
                            const errorResponse = err.response.data.error.errors; // Get the errors from err.response.data
                            for (const key of Object.keys(errorResponse)) { // Loop through all errors and get the messages
                                setErrors({ ...errors, [key]: errorResponse[key].message })
                            }
                        }
                    })
            }
        }
    }
    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col text-right">
                        <Link to="/" className="fs36 text-dark">Back To Dashboard</Link>
                    </div>
                </div>
                <div className="row d-flex transparent-background justify-content-center pb-5">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6 fs32 mt-3">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                {errors.name && <p className="text-danger fs32" >{errors.name}</p>}
                                <label htmlFor="" className="form-heading fs40">Project Name: </label>
                                <input type="text" className="form-control fs32" value={project.name} name="name" onChange={changeHandler} />
                            </div>
                            <div className="form-group">
                                {errors.description && <p className="text-danger" >{errors.description}</p>}
                                <label htmlFor="" className="form-heading fs40">Description: </label>
                                <textarea type="date" className="form-control fs32" value={project.description} name="description" onChange={changeHandler}> </textarea>
                            </div>
                            <div className="form-group">
                                {errors.dueDate && <p className="text-danger" >{errors.dueDate}</p>}
                                <label htmlFor="" className="form-heading fs40">Due Date: </label>
                                <input type="date" className="form-control fs32" value={project.dueDate.substring(0, 10)} name="dueDate" onChange={changeHandler} />
                            </div>
                            {
                                action === "edit" ? 
                                    <><a className="btn fs32 btn-danger mr-5 w200" href="#" onClick={ () => deleteTicket() }>Delete project</a> 
                                    <button className="btn fs32 btn-success w200" type="submit">Update</button></>:
                                    <button className="btn fs32 btn-success w200" type="submit">Submit</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectForm
