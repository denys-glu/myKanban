import React from 'react';

function Ticket({ ticket, callback, initStatus }) {

    const currentDate = new Date();
    let status = "warning";
    let isDue = false;

    //TODO: do we need this here?
    if (ticket.status === "Completed") {
        status = "danger"
    } else if (ticket.status === "In Progress") {
        status = "success"
    }

    if (new Date(ticket.dueDate) < currentDate.setDate(currentDate.getDate() - 1)) {
        isDue = true
    }
    return (
        <>
            <div className="card m-2" >
                <div className="card-body item">
                    
                    {
                        ticket.status === "777" ? 
                        <i className="fas fa-trash ticket-settings"></i>:
                        <i className="fas fa-cog ticket-settings"></i>
                    }
                    <p className="card-title fs32">{ticket.name}</p>
                    {ticket.description && <p className="card-title fs26 text-left">{ticket.description.substring(0, 40) + "..."}</p>}
                    {
                        isDue ?
                            <p className="text-left text-danger">Due date: {ticket.dueDate.slice(0, -14)}</p> :
                            <p className="text-left">Due date: {ticket.dueDate.slice(0, -14)}</p>
                    }
                    <small>Drag&Drop me</small>
                </div>
            </div>
        </>
    )
}

export default Ticket;