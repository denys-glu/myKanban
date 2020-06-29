import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Ticket from './Ticket';

function DnDWrapper({ tickets, setTickets, ticketStatusHandler }) {

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

    const statuses = {
        0: {
            name: "Backlog",
            alias: "backlog"
        },
        1: {
            name: "In Progress",
            alias: "in-progress"
        },
        2: {
            name: "Completed",
            alias: "completed"
        }
    }

    function saveAndSortTickets(data) {
        ''
        console.log("saveAndSortTickets -> data", data)
        data = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        setBacklog(data
            .filter(ticket => ticket.status === "0"))

        setInProgress(data
            .filter(ticket => ticket.status === "1"))

        setCompleted(data
            .filter(ticket => ticket.status === "2"))
    }

    useEffect(() => {
        saveAndSortTickets(tickets)
    }, [tickets])

    // DnD variables
    const [state, setState] = useState(tickets);


    // DnD content

    const grid = 10;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        // padding: grid * 2,
        // margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        // background: isDragging ? "lightgreen" : "grey",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid
    });

    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    /**
     * Moves an item from one list to another list.
     */
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        //inserting "removed" element into destionation array
        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        //updating ticket status
        ticketStatusHandler(removed, droppableDestination.droppableId)
        return result;
    };

    function onDragEnd(result) {
        const { source, destination } = result;
        let localState, setLocalState;
        let futureState, setFutureState;

        // dropped outside the list
        if (!destination) {
            return;
        }
        // TODO: add scalability e.g. ability to work with more than 3 statuses
        if (source.droppableId === "0") {
            localState = backlog;
            setLocalState = setBacklog;
        } else if (source.droppableId === "1") {
            localState = inProgress;
            setLocalState = setInProgress;
        } else if (source.droppableId === "2") {
            localState = completed;
            setLocalState = setCompleted;
        }

        if (destination.droppableId === "0") {
            futureState = backlog;
            setFutureState = setBacklog;
        } else if (destination.droppableId === "1") {
            futureState = inProgress;
            setFutureState = setInProgress;
        } else if (destination.droppableId === "2") {
            futureState = completed;
            setFutureState = setCompleted;
        }

        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(
                [...localState],
                result.source.index,
                result.destination.index
            );
            setLocalState(items);
        } else {
            const result = move(localState, futureState, source, destination);
            setLocalState(result[sInd]);
            setFutureState(result[dInd]);
        }
    }
    let result = Object.values(tickets).reduce((r, ticket) => {
        r[ticket.status] = [...(r[ticket.status] || []), ticket]
        return r;
    }, {})
    // console.log("result: ", result)
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {
                    Object.values(result).map((status, idx) => (
                        <Droppable droppableId={idx+""} key={idx}>
                            {(provided, snapshot) => (
                                <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    <div className="transparent-background pt-3">
                                        <h2 className={statuses[idx].alias + "-heading fs40"}>{statuses[idx].name}</h2>
                                        <div className={"tickets " + statuses[idx].alias}>
                                        {
                                            status.map((ticket, i) => (
                                            <Draggable
                                                key={ticket.id + ""}
                                                draggableId={ticket.id + ""}
                                                index={i}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                            <Ticket ticket={ticket} callback={ticketStatusHandler} initStatus={statuses[idx].name} />
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))
                }

                {/* <Droppable droppableId="0">
                    {(provided, snapshot) => (
                        <div className="col-4"
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <div className="transparent-background pt-3">
                                <h2 className="backlog-heading fs40">Backlog</h2>
                                <div className="tickets backlog">
                                    {
                                        backlog
                                            .map((ticket, i) => (
                                                <Draggable
                                                    key={ticket.id + ""}
                                                    draggableId={ticket.id + ""}
                                                    index={i}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                        >
                                                            <Ticket ticket={ticket} callback={ticketStatusHandler} />
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="1">
                    {(provided, snapshot) => (
                        <div className="col-4 "
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <div className="transparent-background pt-3">
                                <h2 className="in-progress-heading fs40">In Progress</h2>
                                <div className="tickets in-progress">
                                    {
                                        inProgress
                                            .map((ticket, i) => (
                                                <Draggable
                                                    key={ticket.id + ""}
                                                    draggableId={ticket.id + ""}
                                                    index={i}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                        >
                                                            <Ticket ticket={ticket} callback={ticketStatusHandler} />
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="2">
                    {(provided, snapshot) => (
                        <div className="col-4 "
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <div className="transparent-background pt-3">
                                <h2 className="completed-heading fs40">Completed</h2>
                                <div className="tickets completed">
                                    {
                                        completed
                                            .map((ticket, i) => (
                                                <Draggable
                                                    key={ticket.id + ""}
                                                    draggableId={ticket.id + ""}
                                                    index={i}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                        >
                                                            <Ticket ticket={ticket} callback={ticketStatusHandler} />
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable> */}
            </DragDropContext>
        </>
    )
}

export default DnDWrapper;