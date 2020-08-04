const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [3, "Name should be longer than 3 characters!"],
        maxlength: [50, "Name should not be longer than 50 characters!"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
        minlength: [10, "Description should be longer than 10 characters!"],
        maxlength: [1000, "Description should not be longer than 1000 characters!"]
    },
    status: { type: String, default: "0" },
    sortId: { type: Number, default: 0 },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TicketSchema"
        }
    ]
}, { timestamps: true });

const Project = mongoose.model("ProjectSchema", ProjectSchema);

module.exports = Project;