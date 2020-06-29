import React from 'react';

function Ticket({ ticket, callback }) {
// console.log("Ticket -> ticket", ticket)
    
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
            <div className="card item m-2" >
                <div className="card-body">
                    <p className="card-title fs32">{ticket.name}</p>
                        {
                            isDue ?
                            <p className="text-left text-danger">Due date: {ticket.dueDate.slice(0, -14)}</p> :
                            <p className="text-left">Due date: {ticket.dueDate.slice(0, -14)}</p>
                        }
                    {
                        (ticket.status === "Completed") ?
                            <button onClick={ () => callback(ticket)} className={"btn fs28 btn-" + status}>Remove ticket</button>
                        :
                            <button onClick={ () => callback(ticket)} className={"btn fs32 btn-" + status}>{ticket.status} <strong>></strong></button>
                    }
                </div>
            </div>
        </>
    )
}

export default Ticket;