# Zenix — The AI Context Engine

Zenix is a professional, developer-first platform that transforms rough software ideas into complete, implementation-ready development contexts for AI coding agents. Instead of generating raw source code, Zenix generates the **blueprint**—architectures, design tokens, UI rules, and build plans—so that downstream AI tools (like Cursor, Claude Code, or Copilot) can execute with perfect consistency and zero hallucination.

With a heavy emphasis on breathtaking UI/UX, seamless micro-interactions, and a community-driven ecosystem, Zenix bridges the gap between raw idea generation and professional software architecture.

## 🚀 Core Features

### 1. AI Orchestration & Context Generation
- **Intelligent Questioning Wizard**: Zenix interrogates the user's idea to identify missing requirements, tech stacks, color psychology, and typography preferences.
- **Artifact Engine**: Generates a strictly structured suite of context files (e.g., `AGENTS.md`, `architecture.md`, `ui-tokens.md`, `TASKS.md`) that acts as the single source of truth for downstream AI.
- **LangGraph Integration**: Backend powered by `@langchain/langgraph` to process design feedback and maintain an intelligent state machine for conversational AI flows.

### 2. Advanced Authentication & Security
- **Multi-Provider Auth**: Secure authentication supporting both Email/Password and Google OAuth integration via Firebase.
- **Robust Session Management**: Cross-tab state hydration using Zustand persist middleware.

### 3. Premium Creator Profiles
- **Public Showcases**: Highly polished, editorial-style public profiles acting as a creator's storefront for architecture templates.
- **Dynamic Meta Data**: Support for Bios, Locations, Personal Links, and Join Dates.
- **Collectible Badges System**: Gamified achievements featuring custom rarity-based gradient designs and tooltip context.
- **Creator Impact Statistics**: Beautiful metric ribbons displaying a creator's templates, total stars, forks, and followers.

### 4. Community & Social Features
- **Follower Ecosystem**: Fully functioning backend APIs and frontend UI allowing users to follow their favorite creators.
- **Interactive Modals**: Clickable follower/following statistics that open dynamic modal lists (currently laying the foundation for community lists).
- **Profile Interactions**: Social actions like "Share Profile" (copy to clipboard) and user reporting.

### 5. Admin & Project Management
- **Dashboard Hub**: A fluid, responsive sidebar layout providing access to Projects, Playground, Templates, and Settings.
- **Admin Controls**: Dedicated interfaces for managing users, tracking total user/project statistics, and permanently deleting flagged accounts/projects with cascading deletions.
- **Project Workspaces**: A dedicated workspace to oversee AI-generated blueprints, featuring a color-coded file system and split-pane layout with a chat history interface.

### 6. Impeccable Design System
- **State-of-the-Art Aesthetics**: Built utilizing glassmorphism, curated HSL color palettes, and deep dark modes, avoiding generic chat-bot aesthetics.
- **Micro-Interactions**: Powered by Framer Motion for buttery-smooth modals, hover states, and spring-physics animations (e.g., the rotating AI thinking dots, pulse indicators).
- **Toasts over Alerts**: Complete removal of native browser `confirm()` and `alert()` dialogs in favor of custom, non-blocking notifications.

---

## 🔮 Future Scope & Roadmap

### 1. Advanced Community Search Engine
- Implement lightning-fast, highly optimized search algorithms using high-level data structures (e.g., HashMaps, Tries, or Graphs) to allow users to search for creators, templates, and tags instantly without heavy database strain.

### 2. MCP (Model Context Protocol) Integration
- **What it does**: MCP will allow Zenix to expose its generated architecture blueprints (templates, user projects, design tokens) in a standardized, secure way directly to external AI models or IDEs (like Cursor or Windsurf). 
- **The Impact**: This enables AI assistants to seamlessly read a Zenix workspace context, dynamically pull design systems, or suggest code modifications that perfectly align with the established architecture. It turns Zenix into a central nervous system for AI-assisted coding.

### 3. AI-Powered "Playground" Expansion
- Full rollout of the AI design sandbox where users can compile HTML previews of their tokens and architectures before exporting them to an IDE.
- Version control for artifacts, allowing users to fork other creators' context templates and iterate on them.

### 4. Marketplace & Monetization
- Allow Elite creators to monetize their premium architectural context templates.
- Introduce a tipping system or subscription models for top-tier community members.

### 5. Analytics Dashboard
- Provide creators with a detailed breakdown of their traffic: profile views, template forks, and generation metrics using interactive charts.
