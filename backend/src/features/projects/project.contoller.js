import mongoose from 'mongoose';
import Project from "./project.model.js";

export const createProject = async (req, res) => {
  try {
    const { project_title, project_description } = req.body;

    if (!project_title || !project_description) {
      return res.status(400).json({
        message: "Project title and description are required"
      });
    }

    const newProject = await Project.create({
      owner: req.user._id,
      project_title,
      project_description
    });

    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project id"
      });
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const deleteProject = async (req,res)=>{
    try{
        const { id } = req.params;
        const project = await Project.findOneAndDelete({ _id: id, owner: req.user._id });

        if(!project){
            return res.status(404).json({message:"Project not found"});
        }

        res.status(200).json({message:"Project deleted successfully"});
    }
    catch(error){
        console.error('Error deleting project:', error);
        res.status(500).json({message:"Server error"});
    }
}

export const updateProject = async (req,res)=>{
    try{
        const { id } = req.params;
        const { project_title, project_description, project_status } = req.body;

        const project = await Project.findOne({ _id: id, owner: req.user._id });

        if(!project){
            return res.status(404).json({message:"Project not found"});
        }

        if(project_title) project.project_title = project_title;
        if(project_description) project.project_description = project_description;
        if(project_status) project.project_status = project_status;

        await project.save();

        res.status(200).json({message:"Project updated successfully", project });
    }
    catch(error){
        console.error('Error updating project:', error);
        res.status(500).json({message:"Server error"});
    }
}


