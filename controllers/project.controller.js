const Project = require("../models/project.model");
const Ticket = require("../models/ticket.model");


module.exports.getAllProjects = (req, res) => {
    Project.find({})
        .then(allProjects => res.json({message: "Success", results: allProjects}))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.getProject = (req, res) => {
    Project.findById({_id: req.params.id}).populate("tickets")
        .then(project => res.json({message: "Success", results: project}))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.createNewProject = (req, res) => {
    Project.create(req.body)
        .then(newlyCreatedProject => res.json({message: "Success", results: newlyCreatedProject }))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.addTicketToProject = (req, res) => {
    Ticket.create(req.body)
        .then(newTicket => {
            Project.findByIdAndUpdate(
                req.params.id, 
                { $push: { tickets: newTicket._id } },
                { new: true })
                .then(project =>  res.json({message: "Success", 
                    results: `Ticket ${newTicket.name} successfuly added to ${project.name}` }))
                .catch(err => {
                    Ticket.deleteOne({ _id: newTicket._id })
                        .then(result => res.json({message: "Success", results: result }))
                        .catch(err => res.json({ message: "Error", error: err }));
                    res.json({ message: "Error", error: { err, message: "Looks like there is no such project in DB"} })
                })
        })
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.deleteAnExistingProject = (req, res) => {
    Ticket.deleteOne({ _id: req.params.id })
        .then(result => res.json({message: "Success", results: result }))
        .catch(err => res.json({ message: "Error", error: err }));
};