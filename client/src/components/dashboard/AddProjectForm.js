import React, { useState } from 'react';
import { Link, navigate } from '@reach/router';
import axios from 'axios';

function AddProjectForm() {
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueDateError, setDueDateError] = useState("");

    function nameHandler({ name, value }) {
        setName(value)
        if(value.length < 3) {
            setNameErr("Name should be at least 3 characters long");
        } else {
            setNameErr("");
        }
    }

    function dueDateHandler({ name, value }) {
        setDueDate(value)
        if(value != "") {
            setDueDateError("");
        }
    }

    function submitHandler(e) {
        e.preventDefault();
        axios.post('http://localhost:8001/api/projects/new', {name, dueDate})
        .then(res => {
            navigate("/");
        })
        .catch(err => {
            console.log("Error happend :(", err);
            if (err.response.data.error.name === "MongoError") {
                setNameErr(`Project name must be unique, "${err.response.data.error.keyValue.name}" has already been taken!`);
            } else {
                const errorResponse = err.response.data.error.errors; // Get the errors from err.response.data
                for (const key of Object.keys(errorResponse)) { // Loop through all errors and get the messages
                    if(key === "name") {
                        setNameErr(errorResponse[key].message);
                    } else {
                        setDueDateError(errorResponse[key].message);
                    }
                }
            }
        })
    }
    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col text-right">
                        <Link to="/">Back To Dashboard</Link>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-6">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                {nameErr && <p className="text-danger" >{nameErr}</p>}
                                <label htmlFor="">Project Name: </label>
                                <input type="text" className="form-control" value={name} onChange={e => nameHandler(e.target)} />
                            </div>
                            <div className="form-group">
                                {dueDateError && <p className="text-danger" >{dueDateError}</p>}
                                <label htmlFor="">Due Date: </label>
                                <input type="date" className="form-control" value={dueDate} onChange={e => dueDateHandler(e.target)} />
                            </div>
                            <button className="btn btn-success btn-block" type="submit">Add Project</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProjectForm;