import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    project_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    project_title:{
        type: String,
        required: true
    },

    project_description:{
        type: String,
        required: true
    },

    project_status:{
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },

 

},{
    timestamps: true
})


const Project = mongoose.model("Projects", projectSchema);

export default Project;