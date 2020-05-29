import React, { useEffect, useState, Component } from 'react';
import { Link } from '@reach/router';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import Project from './Project';

function Dashboard(props) {
    const [projects, setProjects] = useState([])

    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    // DnD variables
    const [state, setState] = useState(projects);


    useEffect(() => {
        getProjects();
    }, [])

    function getProjects() {
        axios.get('http://localhost:8001/api/projects/all')
            .then(res => {
                
                setInProgress(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "In Progress"))

                setBacklog(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "Backlog"))

                setCompleted(res.data.allProjects
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .filter(project => project.status === "Completed"))

                setProjects(res.data.allProjects.map((project, index) => ({ ...project, id: index+"" })))
            }
        )
    }

    function deleteProject(project) {
        axios.delete(`http://localhost:8001/api/projects/delete/${project._id}`, { id: project._id })
            .then(res => {
                console.log("Successfuly deleted a project: ", res)
                getProjects();
            })
            .catch(err => console.log("Error while deleting: ", err))
    }

    function projectStatusHandler(project) {
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
            default:
                console.log("some unknown status received")
        }

        axios.put(`http://localhost:8001/api/projects/update/${project._id}`, project)
            .then(res => {
                console.log("project successfully updated: ", res)
                getProjects();
            })
            .catch(err => console.log("Error happend while updatin project: ", err))
    }

    // DnD content
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


    const grid = 10;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "grey",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid
    });

    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    function onDragEnd(result) {
        const { source, destination } = result;
        console.log(source, destination)

        // dropped outside the list
        if (!destination) {
            return;
        }

        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;
        // TODO: fix else statement
        if (sInd === dInd) {
            const items = reorder(
                [...projects],
                result.source.index,
                result.destination.index
            );

            setProjects(items);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState.filter(group => group.length));
        }

    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId= "0">
                            {(provided, snapshot) => (
                                <div className="col-sm-6"
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {/* <div className="col-sm-4"> */}
                                        <h2 className="text-primary border">Backlog</h2>
                                        <div className="projects border">
                                            {
                                                projects.map((project, i) => (
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
                                // </div>
                            )}
                        </Droppable>
                        {/* <div className="col-sm-4">
                            <h2 className="text-warning border">In Progress</h2>
                            <div className="projects border">
                                {
                                    inProgress.map((project, i) => <Project key={i} project={project} callback={projectStatusHandler} />)
                                }
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <h2 className="text-success border">Completed</h2>
                            <div className="projects border">
                                {
                                    completed.map((project, i) => <Project key={i} project={project} callback={projectStatusHandler} />)
                                }
                            </div>
                        </div> */}
                    </DragDropContext>
                </div>
                <div className="row">
                    <div className="col text-left p-3">
                        <Link className="btn btn-primary" to="projects/new">
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