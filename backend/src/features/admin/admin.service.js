import User from '../auth/auth.model.js';
import Project from '../projects/project.model.js';
import Task from '../tasks/task.model.js';
import Context from '../context/context.model.js';
import Idea from '../ideas/idea.model.js';
import Brief from '../brief/brief.model.js';
import AIGeneration from '../ai/ai.model.js';
import Artifact from '../artifacts/artifact.model.js';
import mongoose from 'mongoose';
import admin from '../../config/firebase.js';

export const adminService = {
  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  },

  async createUser(userData) {
    const { email, password, name, username } = userData;
    if (!email || !password || !username) {
        throw new Error('Email, password and username are required');
    }
    
    const existing = await User.findOne({ username });
    if (existing) throw new Error('Username already taken');

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name || username
    });

    const user = await User.create({
      email,
      username,
      name,
    });
    
    return user;
  },

  async updateUser(userId, updates) {
    const allowedFields = ['isVerified', 'loyaltyBadges', 'isAdmin', 'name', 'username', 'email'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowedFields.includes(k))
    );

    if (filteredUpdates.username) {
      const existing = await User.findOne({ username: filteredUpdates.username, _id: { $ne: userId } });
      if (existing) throw new Error('Username already taken');
    }

    const user = await User.findByIdAndUpdate(userId, { $set: filteredUpdates }, { new: true }).select('-password');
    if (!user) throw new Error('User not found');

    if (filteredUpdates.email || filteredUpdates.name) {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(user.email);
        await admin.auth().updateUser(firebaseUser.uid, {
          ...(filteredUpdates.email && { email: filteredUpdates.email }),
          ...(filteredUpdates.name && { displayName: filteredUpdates.name })
        });
      } catch (e) {
        console.error("Firebase update failed", e);
      }
    }

    return user;
  },

  async deleteProject(projectId) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    const ideaId = project.wizard_state?.ideaId;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const opts = { session };
      await Project.deleteOne({ _id: projectId }, opts);
      await Task.deleteMany({ project: projectId }, opts);
      await Context.deleteMany({ project: projectId }, opts);
      await Artifact.deleteMany({ project: projectId }, opts);
      await AIGeneration.deleteMany({ project: projectId }, opts);

      if (ideaId) {
        await Idea.deleteOne({ _id: ideaId }, opts);
        await Brief.deleteMany({ idea: ideaId }, opts);
        await AIGeneration.deleteMany({ idea: ideaId }, opts);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    try {
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      await admin.auth().deleteUser(firebaseUser.uid);
    } catch (e) {
      console.error('Firebase user deletion failed', e);
    }

    const projects = await Project.find({ owner: userId });
    for (const project of projects) {
      await this.deleteProject(project._id);
    }
    
    await User.findByIdAndDelete(userId);
  },

  async getAllProjects() {
    return await Project.find().populate('owner', 'name username email').sort({ createdAt: -1 });
  },

  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    return { totalUsers, totalProjects };
  }
};
