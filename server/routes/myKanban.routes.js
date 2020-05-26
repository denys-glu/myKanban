const KanbanController = require("../controllers/myKanban.controller");

module.exports = app => {
    app.get("/api/projects/all", KanbanController.getAllProjects);
    app.post("/api/projects/new", KanbanController.createNewProject);
    app.put("/api/projects/update/:id", KanbanController.updateExistingProjectStatus);
    app.delete("/api/projects/delete/:id", KanbanController.deleteAnExistingProject);
};