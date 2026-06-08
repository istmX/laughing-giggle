import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    description:{
        type:String,
        trim:true,
        maxlength:2000
    },

    /* status = Logical workflow state (pending, in_progress, completed) */
    status:{
        type:String,
        enum:["pending","in_progress","completed"],
        default:"pending"
    },
    /* kanban_status = Visual board position (todo, in_progress, done) */
    kanban_status: {
        type: String,
        enum: ["todo", "in_progress", "done"],
        default: "todo"
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium"
    },
    ai_generated: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})


const Task = mongoose.model("Task",taskSchema)

export default Task;
