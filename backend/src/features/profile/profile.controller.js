import { profileService } from './profile.service.js';
import AppError from '../../utils/AppError.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfile(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    const status = error.message === 'Username already taken' ? 409 : 400;
    next(new AppError(error.message, status));
  }
};

export const updatePfp = async (req, res, next) => {
  try {
    const { pfpUrl } = req.body;
    const user = await profileService.updatePfp(req.user.id, pfpUrl);
    res.status(200).json({ message: 'Profile picture updated', user });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await profileService.deleteAccount(req.user.id);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const data = await profileService.getPublicProfile(username);
    res.status(200).json(data);
  } catch (error) {
    const status = error.message === 'This profile is private' ? 403 : 404;
    next(new AppError(error.message, status));
  }
};

export const toggleFollow = async (req, res, next) => {
  try {
    const { username } = req.params;
    const result = await profileService.toggleFollow(req.user.id, username);
    res.status(200).json(result);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
