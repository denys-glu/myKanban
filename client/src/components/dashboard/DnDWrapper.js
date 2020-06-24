import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Project from './Project';

function DnDWrapper({ projects, setProjects, projectStatusHandler }) {

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    function saveAndSortProjects(data) {
        console.log("saveAndSortProjects -> data", data)
        setBacklog(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "0"))

        setInProgress(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "1"))

        setCompleted(data
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "2"))
    }

    useEffect(() => {
        saveAndSortProjects(projects)
    }, [])

    // DnD variables
    const [state, setState] = useState(projects);
    

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
    const move = (item, destination, droppableSource, droppableDestination) => {
        console.log("move -> droppableDestination", droppableDestination)
        console.log("move -> droppableSource", droppableSource)
        console.log("move -> destination", destination)
        console.log("move -> item", item)

        // const sourceClone = Array.from(source);
        // const destClone = Array.from(destination);
        // const [removed] = sourceClone.splice(droppableSource.index, 1);

        // destClone.splice(droppableDestination.index, 0, removed);
        // console.log("move -> removed", removed)

        // const result = {};
        // result[droppableSource.droppableId] = sourceClone;
        // console.log(droppableSource.droppableId)
        // result[droppableDestination.droppableId] = destClone;

        // return result;
    };

    function onDragEnd(result) {
        const { source, destination } = result;
        let localState, setLocalState;

        console.log(source, destination)

        // dropped outside the list
        if (!destination) {
            return;
        }
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

        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;
        // TODO: fix else statement
        if (sInd === dInd) {
            const items = reorder(
                [...localState],
                result.source.index,
                result.destination.index
            );
            setLocalState(items);
        } else {
            const result = move(projects[sInd], backlog[dInd], source, destination);
            // const newState = [...completed];
            // newState[sInd] = result[sInd];
            // newState[dInd] = result[dInd];

            // setLocalState(newState.filter(group => group.length));
        }

    }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="0">
                    {(provided, snapshot) => (
                        <div className="col-4"
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <div className="transparent-background pt-3">
                                <h2 className="backlog-heading fs40">Backlog</h2>
                                <div className="projects backlog">
                                    {
                                        backlog
                                            .map((project, i) => (
                                                <Draggable
                                                    key={project.id + ""}
                                                    draggableId={project.id + ""}
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
                                                            <Project project={project} callback={projectStatusHandler} />
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
                                <div className="projects in-progress">
                                    {
                                        inProgress
                                            .map((project, i) => (
                                                <Draggable
                                                    key={project.id + ""}
                                                    draggableId={project.id + ""}
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
                                                            <Project project={project} callback={projectStatusHandler} />
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
                                <div className="projects completed">
                                    {
                                        completed
                                            .map((project, i) => (
                                                <Draggable
                                                    key={project.id + ""}
                                                    draggableId={project.id + ""}
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
                                                            <Project project={project} callback={projectStatusHandler} />
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
            </DragDropContext>
        </>
    )
}

export default DnDWrapper;