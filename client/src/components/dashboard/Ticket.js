import React from 'react';

function Ticket({ ticket, callback, initStatus }) {
    
    const currentDate = new Date();
    let status = "warning";
    let isDue = false;
    if(ticket.status === "Completed") {
        status = "danger"
    } else if(ticket.status === "In Progress") {
        status = "success"
    }

    if (new Date(ticket.dueDate) < currentDate.setDate(currentDate.getDate() - 1) ) {
        isDue = true
    }
    return (
        <>
            <div className="card m-2" >
                <div className="card-body item">
                    <p className="card-title fs32">{ticket.name}</p>
                        {
                            isDue ?
                            <p className="text-left text-danger">Due date: {ticket.dueDate.slice(0, -14)}</p> :
                            <p className="text-left">Due date: {ticket.dueDate.slice(0, -14)}</p>
                        }
                    {
                        // TODO: make button a standalone component
                        (ticket.status === "Completed") ?
                            <button onClick={ () => callback(ticket)} className={"btn fs24 btn-" + status}>Remove ticket</button>
                        :
                            <button onClick={() => callback(ticket)} className={"btn fs24 btn-" + status}>{initStatus} <strong>></strong></button>
                    }
                </div>
            </div>
        </>
    )
}

export default Ticket;