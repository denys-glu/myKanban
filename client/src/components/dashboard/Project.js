import React from 'react';

function Project({ project, callback }) {
    const currentDate = new Date();
    let status = "warning";
    let isDue = false;
    if(project.status === "Completed") {
        status = "danger"
    } else if(project.status === "In Progress") {
        status = "success"
    }

    if (new Date(project.dueDate) < currentDate.setDate(currentDate.getDate() - 1) ) {
        isDue = true
    }
    return (
        <>
            <div className="card item m-2" >
                <div className="card-body">
                    <p className="card-title fs32">{project.name}</p>
                        {
                            isDue ?
                            <p className="text-left text-danger">Due date: {project.dueDate.slice(0, -14)}</p> :
                            <p className="text-left">Due date: {project.dueDate.slice(0, -14)}</p>
                        }
                    {
                        (project.status === "Completed") ?
                            <button onClick={ () => callback(project)} className={"btn fs28 btn-" + status}>Remove Project</button>
                        :
                            <button onClick={ () => callback(project)} className={"btn fs32 btn-" + status}>{project.status} <strong>></strong></button>
                    }
                </div>
            </div>
        </>
    )
}

export default Project;