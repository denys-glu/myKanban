const TicketController = require("../controllers/ticket.controller");

module.exports = app => {
    app.get("/api/tickets/", TicketController.getAllTickets);
    app.get("/api/tickets/:id", TicketController.getTicket);

    app.post("/api/tickets/new", TicketController.createNewTicket);

    app.patch("/api/tickets/update/:id", TicketController.updateExistingTicketStatus);
    
    app.delete("/api/tickets/delete/:id", TicketController.deleteAnExistingTicket);
};