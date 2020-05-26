const ProjectManager = require("../controllers/projectManager.controller");

module.exports = app => {
    app.get("/api/projects/all", ProjectManager.getAllProjects);
    app.post("/api/projects/new", ProjectManager.createNewProject);
    app.put("/api/projects/update/:id", ProjectManager.updateExistingProject);
    app.delete("/api/projects/delete/:id", ProjectManager.deleteAnExistingProject);
};