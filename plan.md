# Zenix Roadmap & Migration Plan

This document maps out the system architecture and prioritizes implementation tasks for the Zenix backend and frontend, including the transition to LangGraph/LangChain, Firebase Google Auth, the Profile feature, and the AI Design System Playground.

---

## 1. Prioritized Implementation Path

We have structured the development roadmap by dependency and critical importance.

### Priority 1: Core Cleanups & Verification
1. **Decommission Legacy Orchestrator**: Delete `ai.orchestrator.js` and move logic into clean controllers.
2. **ZIP Export Verification**: Confirm that the hardened `exportArtifactsZip` code successfully handles empty files and streams without crashing the backend process.

### Priority 2: Authentication Migration (Firebase Google Login)
1. **Frontend Authentication Update**: Replace old custom Google redirect flow with Firebase's client SDK authentication using `signInWithPopup`.
2. **Backend Authentication Verification**: Install `firebase-admin` on the backend, update `POST /auth/google` to verify the Firebase client ID Token, and issue the application's secure JWT.

### Priority 3: Backend Profile Feature Integration
1. **Domain Creation**: Set up a new backend feature folder: `backend/src/features/profile/` (owning routes, controller, model updates, and service logic).
2. **Profile API Development**:
   * `PUT /api/profile` — Update username and user info.
   * `DELETE /api/profile` — Cascade delete user account and associated projects.
   * `PUT /api/profile/pfp` — Update PFP link.
3. **PFP Architecture (DiceBear API)**:
   * Google sign-ins default to their Google avatar URL.
   * Custom avatars: Frontend paginates/renders generated avatar choices using the DiceBear avatar API. The user selects an avatar, and the backend saves only the resulting image URL string into MongoDB.

### Priority 4: LangGraph Context & Artifact Engine
1. **Graph Setup**: Build the sequential node-based context graph inside `src/features/ai/graphs/context_engine.graph.js`.
2. **Verify Loop**: Implement the requirements checking and auto-correct loop (limited to 3 iterations) to fix mismatched files.

### Priority 5: Standalone Design Playground & Upstash Persistence
1. **Graph Setup**: Create `playground.graph.js` isolated to secondary API keys (`*_II`).
2. **Session Persistence**: Setup MongoDB `PlaygroundSession` to load and save tokens and chat logs.
3. **Distributed Checkpointer**: Connect `@upstash/redis` to persist LangGraph execution nodes.
4. **Rate Limiting**: Add a playground-scoped middleware under `src/features/playground/middleware/` restricting queries to 15/hour.

### Priority 6: Gamification, Templates & Admin Dashboard
1. **Loyalty & Verification Badges**: Attribute templates to usernames, awarding "Verified" and active badges.
2. **Admin Dashboard**: Create a global admin dashboard panel with universal permissions.

---

## 2. Directory Layout & Standards

### Backend Structure
* **Global Middleware**: Place in `backend/src/middleware/`.
* **Playground Domain**: Place in `backend/src/features/playground/`.
* **Profile Domain**: Place in `backend/src/features/profile/`.
* **LangGraph Folder**: Place in `backend/src/features/ai/graphs/`.

---

## 3. MongoDB Schema Configurations

### A. User Profile Fields
```javascript
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  pfpUrl: { type: String }, // Stores Google PFP or selected DiceBear URL
  isVerified: { type: Boolean, default: false },
  loyaltyBadges: [{ type: String }], // e.g., ["Early Adopter", "Template Creator"]
  isAdmin: { type: Boolean, default: false }
});
```

### B. Playground Session
```javascript
const PlaygroundSessionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New Design Session" },
  tokens: { type: Object, default: {} }, 
  chatHistory: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true }
    }
  ],
  previewHtml: { type: String },
  updatedAt: { type: Date, default: Date.now }
});
```
