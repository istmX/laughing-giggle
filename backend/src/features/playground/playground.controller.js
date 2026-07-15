import { playgroundService } from './playground.service.js';
import AppError from '../../utils/AppError.js';

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

    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/playground", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        designTokens: sessionWithUserMessage.tokens || {},
      })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    const finalState = await response.json();

    let aiMessage = finalState.message || "Here are your updated design tokens.";
    // Failsafe: if the python backend leaked raw JSON into the message string, intercept it
    if (aiMessage.includes('"typography":') || aiMessage.includes('"designTokens":') || aiMessage.includes('{\n  "')) {
      aiMessage = "I have updated the design tokens based on your request.";
    }

    // Auto-generate title if it's the first message and still the default
    if (sessionWithUserMessage.chatHistory.length === 1 && sessionWithUserMessage.title === 'New Session') {
      const generatedTitle = message.substring(0, 30) + (message.length > 30 ? '...' : '');
      await playgroundService.updateTitle(req.params.sessionId, req.user.id, generatedTitle);
    }

    // Save AI response to chat history
    await playgroundService.addMessage(
      req.params.sessionId,
      req.user.id,
      'assistant',
      aiMessage
    );

    const session = await playgroundService.updatePreview(
      req.params.sessionId,
      req.user.id,
      '', // HTML preview removed, using JSON tokens
      finalState.designTokens
    );

    res.status(200).json({ session });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
