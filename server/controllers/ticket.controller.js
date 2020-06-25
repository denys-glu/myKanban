const Ticket = require("../models/ticket.model");

module.exports.getAllTickets = (req, res) => {
    Ticket.find()
        .then(allTicket => res.json(allTicket))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.createNewTicket = (req, res) => {
    Ticket.create(req.body)
        .then(newlyCreatedTicket => res.json({ ticket: newlyCreatedTicket }))
        .catch(err => res.status(400).json({ message: "Something went wrong", error: err }));
};

module.exports.updateExistingTicketStatus = (req, res) => {
    Ticket.findOneAndUpdate({ _id: req.params.id }, { $set: { status: req.body.status } }, { new: true, runValidators: true })
        .then(ticket => res.json({ ticket }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteAnExistingTicket = (req, res) => {
    Ticket.deleteOne({ _id: req.params.id })
        .then(result => res.json({ result: result }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};