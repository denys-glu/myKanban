const Ticket = require("../models/ticket.model");

module.exports.getAllTickets = (req, res) => {
    Ticket.find({})
        .then(allTicket => res.json({message: "Success", results: allTicket}))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.getTicket = (req, res) => {
    Ticket.findOne({_id: req.params.id})
        .then(allTicket => res.json({message: "Success", results: allTicket}))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.createNewTicket = (req, res) => {
    Ticket.create(req.body)
        .then(newlyCreatedTicket => res.json({message: "Success", results: newlyCreatedTicket }))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.updateExistingTicketStatus = (req, res) => {
    Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(ticket => res.json({message: "Success", results: ticket }))
        .catch(err => res.json({ message: "Error", error: err }));
};

module.exports.deleteAnExistingTicket = (req, res) => {
    Ticket.deleteOne({ _id: req.params.id })
        .then(result => res.json({message: "Success", results: result }))
        .catch(err => res.json({ message: "Error", error: err }));
};