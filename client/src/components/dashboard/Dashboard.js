import React, { useEffect, useState, useContext } from 'react';
import { Link } from '@reach/router';
import axios from 'axios';

import Context from '../utilities/MainContext';
import DnDWrapper from './DnDWrapper';

function Dashboard() {
    const [tickets, setTickets] = useState([])
    const [loaded, setLoaded] = useState(false)

    const API_URL = useContext(Context).API_URL;
   
    useEffect(() => {
        getTickets();
    }, [])

    function getTickets() {
        axios.get(API_URL)
            .then(res => {
                if(res.data.message === "Success") {
                    // console.log("getTickets -> res.data", res.data.results)
                    setTickets(res.data.results)
                    setLoaded(true)
                }
            })
            .catch(err => console.warn(err))
    }
    
    //TODO: there is another delete ticjketc function inside TicketForm, find way how to remove one of them
    function deleteTicket(ticket) {
        axios.delete(`${API_URL}/delete/${ticket._id}`, { id: ticket._id })
            .then(res => {
                console.log("Successfuly deleted a ticket: ", res)
                getTickets();
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function ticketStatusHandler(ticket, newStatus) {
    console.log("ticketStatusHandler -> ticket, newStatus", ticket, newStatus)
        // TODO: Fix change status, new statuses structure?
        if (ticket.status === "2" && newStatus === undefined) {
            console.log("delete")
            deleteTicket(ticket);
            return;
        } else if (ticket.status !== "2" && newStatus === undefined) {
            console.log("else if")

        } else {
            console.log("else")
            ticket.status = newStatus;
            axios.patch(`${API_URL}/update/${ticket._id}`, ticket)
                .then(res => {
                    console.log("ticket successfully updated: ", res)
                    getTickets();
                })
                .catch(err => console.log("Error happend while updatin ticket: ", err))
        }

    }
    
    return (
        <>
            <div className="container mt-5">

                <div className="row">
                    {loaded ?
                        <DnDWrapper tickets={tickets} 
                            setTickets={setTickets} 
                            ticketStatusHandler={ticketStatusHandler} />:
                    <p>Loading...</p>
                    }
                </div>
                <div className="row">
                    <div className="col text-left p-3">
                        <Link className="btn fs32 btn-success" to="tickets/new">
                            <div className="plus radius mr-2"></div>
                            Add New Ticket
                        </Link>
                        <Link className="btn fs32 btn-warning ml-5" to="changelog"><strong>Changelog</strong></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;