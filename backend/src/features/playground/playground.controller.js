import { playgroundService } from './playground.service.js';
import AppError from '../../utils/AppError.js';
import { playgroundGraph } from '../ai/graphs/playground.graph.js';

export const createSession = async (req, res, next) => {
  try {
    const { title } = req.body;
    const session = await playgroundService.createSession(req.user.id, title);
    res.status(201).json({ session });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await playgroundService.getSessions(req.user.id);
    res.status(200).json({ sessions });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await playgroundService.getSession(req.params.sessionId, req.user.id);
    res.status(200).json({ session });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    await playgroundService.deleteSession(req.params.sessionId, req.user.id);
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};

export const updateSessionTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return next(new AppError('Title is required', 400));
    const session = await playgroundService.updateTitle(
      req.params.sessionId,
      req.user.id,
      title
    );
    res.status(200).json({ session });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return next(new AppError('Message is required', 400));

    const sessionWithUserMessage = await playgroundService.addMessage(
      req.params.sessionId,
      req.user.id,
      'user',
      message
    );

    const messages = sessionWithUserMessage.chatHistory.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const finalState = await playgroundGraph.invoke({
      messages,
      designTokens: sessionWithUserMessage.tokens || {},
    });

    const session = await playgroundService.updatePreview(
      req.params.sessionId,
      req.user.id,
      finalState.previewHtml,
      finalState.designTokens
    );

    res.status(200).json({ session });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
