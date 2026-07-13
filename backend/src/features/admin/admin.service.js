import User from '../auth/auth.model.js';
import Project from '../projects/project.model.js';

export const adminService = {
  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  },

  async updateUser(userId, updates) {
    const allowedFields = ['isVerified', 'loyaltyBadges', 'isAdmin', 'name', 'username'];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowedFields.includes(k))
    );

    const user = await User.findByIdAndUpdate(userId, { $set: filteredUpdates }, { new: true }).select('-password');
    if (!user) throw new Error('User not found');
    return user;
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
