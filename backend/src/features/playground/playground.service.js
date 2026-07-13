import PlaygroundSession from './playground.model.js';

export const playgroundService = {
  async createSession(userId, title) {
    const session = await PlaygroundSession.create({
      owner: userId,
      title: title || 'New Design Session',
    });
    return session;
  },

  async getSessions(userId) {
    return await PlaygroundSession.find({ owner: userId })
      .sort({ updatedAt: -1 })
      .select('-chatHistory -previewHtml');
  },

  async getSession(sessionId, userId) {
    const session = await PlaygroundSession.findOne({ _id: sessionId, owner: userId });
    if (!session) throw new Error('Session not found');
    return session;
  },

  async addMessage(sessionId, userId, role, content) {
    const session = await PlaygroundSession.findOneAndUpdate(
      { _id: sessionId, owner: userId },
      { $push: { chatHistory: { role, content } }, $set: { updatedAt: new Date() } },
      { new: true }
    );
    if (!session) throw new Error('Session not found');
    return session;
  },

  async updatePreview(sessionId, userId, previewHtml, tokens) {
    const update = { previewHtml, updatedAt: new Date() };
    if (tokens) update.tokens = tokens;
    const session = await PlaygroundSession.findOneAndUpdate(
      { _id: sessionId, owner: userId },
      { $set: update },
      { new: true }
    );
    if (!session) throw new Error('Session not found');
    return session;
  },

  async updateTitle(sessionId, userId, title) {
    const session = await PlaygroundSession.findOneAndUpdate(
      { _id: sessionId, owner: userId },
      { $set: { title } },
      { new: true }
    );
    if (!session) throw new Error('Session not found');
    return session;
  },

  async deleteSession(sessionId, userId) {
    const result = await PlaygroundSession.deleteOne({ _id: sessionId, owner: userId });
    if (result.deletedCount === 0) throw new Error('Session not found');
  },
};
