const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const TicketSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [3, "Name should be longer than 3 characters!"],
        unique: true
    },
    description: {
        type: String,
        minlength: [10, "Description should be longer than 10 characters!"]
    },
    status: { type: String, default: "0" },
    sortId: { type: Number, default: 0 },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    },
    // parent: {
    //TODO: add parent, or one to many realtionship
    // }
}, { timestamps: true });

TicketSchema.plugin(AutoIncrement, {inc_field: "id"})
const Ticket = mongoose.model("TicketSchema", TicketSchema);

module.exports = Ticket;