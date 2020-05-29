const Project = require("../models/project.model");

module.exports.getAllProjects = (req, res) => {
    Project.find()
        .then(allProjects => res.json({ allProjects }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.getAllProjectsSocket = (callback) => {
    Project.find()
        .then(allProjects => {
            callback(allProjects)
        })
        .catch(err => callback({ message: "Something went wrong", error: err }));
};

module.exports.updateExistingProjectStatusSocket = (req, callback) => {
    // console.log("module.exports.updateExistingProjectStatus -> req.body", req)
    Project.findOneAndUpdate({ _id: req._id }, { $set: { status: req.status } }, { new: true, runValidators: true })
        .then(project => Project.find()
            .then(allProjects => {
                callback(allProjects)
            })
            .catch(err => callback({ message: "Something went wrong", error: err })))
        .catch(err => callback({ message: "Something went wrong", error: err }));
};

module.exports.deleteAnExistingProjectSocket = (project, callback) => {
    // console.log("module.exports.deleteAnExistingProject -> req", req.params)
    Project.deleteOne({ _id: project._id })
        .then(result => Project.find()
            .then(allProjects => {
                callback(allProjects)
            })
            .catch(err => callback({ message: "Something went wrong", error: err })))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.createNewProject = (req, res) => {
    // console.log("module.exports.createNewProject -> req.body", req.body)

    Project.create(req.body)
        .then(newlyCreatedProject => res.json({ project: newlyCreatedProject }))
        .catch(err => res.status(400).json({ message: "Something went wrong", error: err }));
};

module.exports.updateExistingProjectStatus = (req, res) => {
    // console.log("module.exports.updateExistingProjectStatus -> req.body", req.body.status)
    Project.findOneAndUpdate({ _id: req.params.id }, { $set: { status: req.body.status } }, { new: true, runValidators: true })
        .then(project => res.json({ project }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteAnExistingProject = (req, res) => {
    // console.log("module.exports.deleteAnExistingProject -> req", req.params)
    Project.deleteOne({ _id: req.params.id })
        .then(result => res.json({ result: result }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};