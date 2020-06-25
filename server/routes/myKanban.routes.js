const TicketController = require("../controllers/ticket.controller");

module.exports = app => {
    app.get("/api/tickets/all", TicketController.getAllTickets);
    app.post("/api/tickets/new", TicketController.createNewTicket);
    app.put("/api/tickets/update/:id", TicketController.updateExistingTicketStatus);
    app.delete("/api/tickets/delete/:id", TicketController.deleteAnExistingTicket);
};