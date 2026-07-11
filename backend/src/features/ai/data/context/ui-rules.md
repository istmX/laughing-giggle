# UI Rules

## Purpose

These rules define how every ScribbleBox screen should be designed.

If a UI decision conflicts with this file, this file wins.

---

# Design Philosophy

ScribbleBox is not a productivity app.

ScribbleBox is not a dashboard.

ScribbleBox is not a file manager.

It is a memory journal.

The interface should feel emotional.

---

# Screen Structure

Most screens should follow:

Header

↓

Hero Section

↓

Content

↓

Bottom Navigation

Avoid screens that immediately begin with lists.

---

# Illustration Usage

Illustrations are mandatory for:

- onboarding
- authentication
- empty states
- clear data screen

Illustrations are optional elsewhere.

---

# Empty State Rules

Every empty state must include:

Illustration

↓

Headline

↓

Description

↓

Action Button

Never show:

"No Data Found"

Never show:

"Empty"

Use human language.

Examples:

Your box is empty.

No memories yet.

Nothing pinned yet.

---

# Buttons

Primary Button

Filled Purple

Secondary Button

White Surface

Danger Button

Coral

---

# Cards

Cards must:

- use large radius
- feel soft
- use subtle shadows

Avoid:

- sharp corners
- dark borders

---

# Home Screen Rules

Must contain:

Greeting

Pinned Memories

Recent Screenshots

Quick Actions

The Home screen is not a gallery.

---

# Collection Rules

Collections are visual.

Every collection requires:

Cover Image

Collection Name

Screenshot Count

Collections should never look like folders in a file explorer.

---

# Timeline Rules

Timeline should feel like:

A journal

Not:

A database

Dates should feel important.

---

# FAB Rules

The FAB always represents:

Add Screenshot

Do not overload the FAB.

---

# Search Rules

Search must be lightweight.

Do not add advanced filtering in MVP.

---

# Settings Rules (Public Screens Only)

Settings for public end-user screens should remain simple.
- No developer settings.
- No technical screens.
- No debug menus.

*Note: The Developer Chat Sandbox and AI-assisted context-generation interfaces are fully allowed on designated developer-facing workspaces.*

---

# Visual Density

Always choose:

More whitespace

Less clutter

Bigger touch targets

Avoid crowded layouts.

---

# Accessibility

Minimum touch target:

44px

Text must remain readable.

Never use low-contrast text.

---

# Things To Avoid (On Public / End-User Surfaces)

Glassmorphism

Neumorphism

Material Design Defaults

Corporate Dashboards (except for developer workspace spec panels)

Tiny Icons

Complex Navigation

Overloaded Screens

AI Features on core public gallery/timeline views (fully allowed in Developer Chat Sandbox)

Premature Features

---

# ScribbleBox Test

Before shipping any screen ask:

Does this feel like a scrapbook?

If the answer is no,

redesign it.