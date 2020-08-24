import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link, useRouteMatch } from 'react-router-dom';

import Storage from '../../utilities/Storage';
import LgroupBy from 'lodash/groupBy';
import Ticket from './Ticket';

function DnDWrapper({ tickets, ticketStatusHandler, deleteHandler }) {
    const { path, url } = useRouteMatch();
    const [groupedBy, setGroupedBy] = useState({});

    const statuses = Storage.get("settings")["statuses"]

    function saveAndGroupTickets() {
        // checking if we have all statuses
        let temp = LgroupBy(tickets, "status");
        for(let key in statuses) {
            if(!temp.hasOwnProperty(key)) {
               temp[key] = []
            }
        }
        setGroupedBy(temp)
    }

    useEffect(() => {
        saveAndGroupTickets()
    }, [])

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

    // Reorder items in the same category
    const reorder = (list, startIndex, endIndex) => {
        console.log("reorder -> list, startIndex, endIndex", list, startIndex, endIndex)
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        console.log("reorder -> removed", removed.name)

        console.log("reorder -> result[endIndex]", result[endIndex].name)
        let tempPriority = removed.priority;
        removed.priority = result[endIndex].priority;
        result[endIndex].priority = tempPriority + 1;
        // removed.priority = endIndex+1;
        // result[endIndex].priority = startIndex+1;

        result.splice(endIndex, 0, removed);

        return result;
    };

    /**
     * Moves an item from one category to another category.
     */
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(groupedBy[source]);
        const destClone = Array.from(groupedBy[destination]);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        removed.status = destination + ""
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
        // console.log("onDragEnd -> source, destination", source, destination)
        // console.log(groupedBy[+source.droppableId])

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;
        if (sInd !== dInd) {
            console.log("doing DnD stuff")
            const updatedData = move(sInd, dInd, source, destination);

            setGroupedBy(prevState => ({
                ...prevState,
                [sInd]: updatedData[sInd],
                [dInd]: updatedData[dInd]
            }))
        } else {
            return
        }
    }

    // console.log("result: ", result)
    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {
                    Object.entries(groupedBy).map(([key], idx) => (

                        <Droppable droppableId={key + ""} key={idx}>

                            {(provided, snapshot) => (
                                <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    <div className="transparent-background pt-3 pb-3">
                                        <h2 className={statuses[key].alias + "-heading fs40"}>{statuses[key].name}</h2>
                                        <div className={"tickets " + statuses[key].alias}>
                                            {
                                                groupedBy[key].sort(t => t.sortId).map((ticket, i) => (
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
                                                                <Link to={{
                                                                        pathname: `${url}/${ticket._id}/edit`,
                                                                        state: { id: ticket._id,
                                                                                action: "edit",
                                                                                deleteHandler: deleteHandler
                                                                            }
                                                                        }} 
                                                                        className="remove-link-styles">
                                                                    <Ticket ticket={ticket} 
                                                                            callback={ticketStatusHandler} 
                                                                            initStatus={statuses[key].name}/>
                                                                </Link>
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))
                }
            </DragDropContext>

        </>
    )
}

export default DnDWrapper;