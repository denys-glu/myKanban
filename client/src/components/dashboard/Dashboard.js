import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import Project from './Project';

function Dashboard() {
    const [projects, setProjects] = useState([])

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);

    // DnD variables
    const [state, setState] = useState(projects);
    const API_URL = `http://localhost:8000/api/projects/`;

    useEffect(() => {
        getProjects();
    }, [])

    function getProjects() {
        axios.get(API_URL + "all")
            .then(res => saveAndSortProjects(res.data))
    }

    function saveAndSortProjects(data) {
        console.log("saveAndSortProjects -> data", data)
        let allProjects = data.map((project, index) => ({ ...project, id: index + "" }))

        setInProgress(allProjects
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "In Progress"))

        setBacklog(allProjects
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "Backlog"))

        setCompleted(allProjects
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .filter(project => project.status === "Completed"))

        setProjects(allProjects.map((project, index) => ({ ...project, id: index + "" })))
    }

    function deleteProject(project) {
        axios.delete(`${API_URL}delete/${project._id}`, { id: project._id })
            .then(res => {
                console.log("Successfuly deleted a project: ", res)
                getProjects();
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function projectStatusHandler(project, newStatus) {

        if (project.status === "Completed") {
            deleteProject(project);
            return true;
        }
        switch (project.status) {
            case "Backlog":
                project.status = "In Progress"
                break;
            case "In Progress":
                project.status = "Completed"
                break;
            case "Completed":
                project.status = "Backlog"
                break;
            default:
                console.log("some unknown status received")
        }
        axios.put(`${API_URL}update/${project._id}`, project)
            .then(res => {
                console.log("project successfully updated: ", res)
                getProjects();
            })
            .catch(err => console.log("Error happend while updatin project: ", err))
    }

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
        // console.log(source);
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        // console.log(droppableSource.droppableId)
        result[droppableDestination.droppableId] = destClone;

        return result;
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
        } else {
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
            const result = move(projects[sInd], projects[dInd], source, destination);
            const newState = [...projects];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setProjects(newState.filter(group => group.length));
        }

    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId= "0">
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
                                                        key={project.id}
                                                        draggableId={project.id}
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
                        <Droppable droppableId= "1">
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
                                                        key={project.id}
                                                        draggableId={project.id}
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
                        <Droppable droppableId= "2">
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
                                                        key={project.id}
                                                        draggableId={project.id}
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
                </div>
                <div className="row">
                    <div className="col text-left p-3">
                        <Link className="btn  fs32 btn-success" to="projects/new">
                            <div className="plus radius mr-2"></div>
                            Add New Project
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;