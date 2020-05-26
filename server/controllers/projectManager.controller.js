const Project = require("../models/project.model");

module.exports.getAllProjects = (req, res) => {
    Project.find()
        .then(allProjects => res.json({ allProjects }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.createNewProject = (req, res) => {
    console.log("module.exports.createNewProject -> req.body", req.body)

    Project.create(req.body)
        .then(newlyCreatedProject => res.json({ project: newlyCreatedProject }))
        .catch(err => res.status(400).json({ message: "Something went wrong", error: err }));
};

module.exports.updateExistingProject = (req, res) => {
    console.log("module.exports.updateExistingPlayer -> req.body", req.body)
    Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(project => res.json({ project }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteAnExistingProject = (req, res) => {
    console.log("module.exports.deleteAnExistingProject -> req", req.params)
    Project.deleteOne({ _id: req.params.id })
        .then(result => res.json({ result: result }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};
