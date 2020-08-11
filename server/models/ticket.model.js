const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const TicketSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [5, "Name should be longer than 5 characters!"],
        maxlength: [50, "Name should not be longer than 50 characters!"]
    },
    description: {
        type: String,
        minlength: [10, "Description should be longer than 10 characters!"],
        maxlength: [1000, "Description should not be longer than 1000 characters!"]
    },
    status: { type: String, default: "0" },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    }
}, { timestamps: true });

TicketSchema.plugin(AutoIncrement, {inc_field: "id"})
TicketSchema.plugin(AutoIncrement, { inc_field: "priority"})

const Ticket = mongoose.model("TicketSchema", TicketSchema);

module.exports = Ticket;