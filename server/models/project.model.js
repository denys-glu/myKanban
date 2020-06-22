const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [3, "Name should be longer than 3 characters!"],
        unique: true
    },
    status: { type: String, default: 0 },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    }
}, { timestamps: true });

ProjectSchema.plugin(AutoIncrement, {inc_field: "id"})
const Project = mongoose.model("ProjectSchema", ProjectSchema);

module.exports = Project;