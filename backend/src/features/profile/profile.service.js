import User from '../auth/auth.model.js';
import Project from '../projects/project.model.js';
import Artifact from '../artifacts/artifact.model.js';

export const profileService = {
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    const followersCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;
    return { ...user.toObject(), followersCount, followingCount };
  },

  async updateProfile(userId, updates) {
    const allowed = ['name', 'username', 'isPublic', 'bio', 'location', 'personalLink'];
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
      { $set: { avatar: pfpUrl } },
      { new: true }
    ).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  },

  async getPublicProfile(username) {
    const user = await User.findOne({ username })
      .select('-password -email -googleId -provider')
      .populate('followers', 'username name avatar lastActiveAt bio')
      .populate('following', 'username name avatar lastActiveAt bio');
    if (!user) throw new Error('User not found');
    if (!user.isPublic) throw new Error('This profile is private');
    
    const stats = {
      templates: 0,
      forks: 0,
      stars: 0,
      downloads: 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0
    };
    
    return { user, stats, templates: [] };
  },

  async toggleFollow(currentUserId, targetUsername) {
    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) throw new Error('User not found');
    if (targetUser._id.toString() === currentUserId.toString()) {
      throw new Error('You cannot follow yourself');
    }

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following?.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUserId } });
      return { isFollowing: false };
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: currentUserId } });
      return { isFollowing: true };
    }
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
