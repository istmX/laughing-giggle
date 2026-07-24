# Zenix Project Overview — Visual Portfolio & Showcase Blueprint

This document defines the core product vision, target audience, non-negotiable user journeys, screen wireframe specs, and functional requirements for visual portfolios, agency showcases, developer sites, and landing pages.

---

# 1. Executive Summary & Product Vision

### Vision Statement
This application is a high-impact, visual showcase platform designed to present projects, technical expertise, and career milestones in a visually captivating, fast, and responsive user interface.

### Target Audience
- Potential clients seeking high-quality agency or developer services.
- Hiring managers, recruiters, and engineering leaders evaluating technical capabilities.
- Creative collaborators and open-source contributors.

### Core Value Proposition
- Instant visual impact via a high-contrast hero banner and marquee ticker.
- Interactive project showcase grid with real-time category filtering.
- Comprehensive technical skills matrix and career timeline.
- One-click social connectivity and contact inquiry.

---

# 2. Non-Negotiable User Journeys

1. **Hero Section Entry Journey**:
   - Visitor lands on the main URL.
   - HeaderNav stays sticky at top with glassmorphic backdrop blur.
   - Marquee ticker loops continuously across top of hero.
   - 70vh cover image displays brand identity visual with headline and primary CTA ("View Projects").

2. **Project Exploration & Modal Inspection Journey**:
   - Visitor scrolls down to the Gallery section.
   - Visitor clicks category filter tabs (`All`, `Branding`, `Web Development`, `3D Motion`).
   - Cards animate via GSAP stagger reveal.
   - Visitor clicks a project card to open a slide-over drawer or modal displaying full project description, tech stack tags, and live links.

3. **Skills & Career Review Journey**:
   - Visitor reviews technical skills grouped by category pills.
   - Visitor views career timeline cards showing job roles, dates, and achievements.

4. **Contact & Social Connect Journey**:
   - Visitor scrolls to footer section to access social media links (GitHub, LinkedIn, Twitter/X, Email).
   - One-click email button opens mailto or contact modal.

---

# 3. Comprehensive Functional Requirements

### Header & Navigation
- Sticky glassmorphic navbar with logo, section navigation links, theme toggle (dark/light), and contact button.
- Mobile hamburger menudrawer for screens < 768px.

### Hero Showcase
- Marquee brand ticker text loop.
- Headline (`display-xl` font) + Subhead paragraph (`body-lg` font).
- Category pill badge with pulsing status dot.
- Primary CTA button (fill) and Secondary CTA button (hover-fill outline).
- 70vh height cover media banner.

### Project Gallery
- Category filter tab buttons.
- Grid card layout (3 columns on desktop, 2 columns on tablet, 1 column on mobile).
- Image hover zoom effect (`scale-102`).
- Project tags, title, description, and external live link buttons.

### Technical Skills & Experience
- Categorized skill pill badges with high-contrast surfaces.
- Career experience timeline cards with company name, title, dates, and key accomplishments.

### Footer
- Brand slogan, navigation column links, social media icon buttons, copyright statement.

---

# 4. Screen Wireframe Specifications

- **Screen 1: Hero Banner** (70vh cover media, display title, marquee ticker, CTA buttons).
- **Screen 2: Project Gallery** (Filter tabs, 3-column project cards, hover animations).
- **Screen 3: Skills & Experience** (Categorized skill pills, vertical timeline cards).
- **Screen 4: Footer** (Glassmorphic footer container, social icons, contact button).
