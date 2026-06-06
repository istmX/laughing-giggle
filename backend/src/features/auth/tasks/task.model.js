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
        required:true,
        trim:true,
        maxlength:2000
    },

    status:{
        type:String,
        enum:["pending","in_progress","completed"],
        default:"pending"
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium"
    }
},{
    timestamps:true
})


const Task = mongoose.model("Task",taskSchema)

export default Task;