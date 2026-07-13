import User from '../auth/auth.model.js';
import Project from '../projects/project.model.js';
import Artifact from '../artifacts/artifact.model.js';

export const profileService = {
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateProfile(userId, updates) {
    const allowed = ['name', 'username'];
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );

    // Validate and check username uniqueness if being changed
    if (filtered.username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(filtered.username))
        throw new Error('Username can only contain letters, numbers, and underscores');

      const existing = await User.findOne({
        username: filtered.username,
        _id: { $ne: userId },
      });
      if (existing) throw new Error('Username already taken');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filtered },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async updatePfp(userId, pfpUrl) {
    if (!pfpUrl || typeof pfpUrl !== 'string') throw new Error('Invalid PFP URL');
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { pfpUrl } },
      { new: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async deleteAccount(userId) {
    // Cascade delete: projects -> artifacts
    const projects = await Project.find({ owner: userId });
    for (const project of projects) {
      await Artifact.deleteMany({ project: project._id });
    }
    await Project.deleteMany({ owner: userId });
    await User.findByIdAndDelete(userId);
  },
};
