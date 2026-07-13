import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const playgroundSessionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Design Session', trim: true },
    tokens: { type: mongoose.Schema.Types.Mixed, default: {} },
    chatHistory: [chatMessageSchema],
    previewHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

const PlaygroundSession = mongoose.model('PlaygroundSession', playgroundSessionSchema);
export default PlaygroundSession;
