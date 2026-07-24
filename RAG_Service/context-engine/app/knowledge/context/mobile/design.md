# ScribbleBox Mobile Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component inside ScribbleBox Mobile (Expo & React Native). Every design decision should reinforce clarity, responsiveness, and touch feedback.

---

# Part 1: Core Principles & Golden Rules

## Simplicity
Design should reveal only what the mobile user needs in the current moment. Hide unnecessary complexity, reduce cognitive load, and guide users one decision at a time without sacrificing power.

## Fluidity
Every mobile interaction should feel connected. Elements should transform naturally with 60fps gesture feedback instead of appearing or disappearing abruptly.

## Delight
Delight should be intentional, not constant. Small moments of thoughtful touch feedback (`active:opacity-80`, `active:scale-98`) create emotional connection without distracting from memory curation.

## Accessibility & Touch Safety
Touch target areas MUST be at least `44px` x `44px` (`min-h-[44px] min-w-[44px]`). Accessibility is a design requirement, not an afterthought.

---

# Part 2: Design Tokens & Mobile Palette Specifications

Never hardcode colors, spacing, typography, radius values, or shadows. Always use these NativeWind design tokens:

## Colors
- **Canvas Base (`bg-background`)**: `#0F0F12` (Dark Mode Obsidian) / `#FAFAFA` (Light Mode Canvas)
- **Surface Card (`bg-card`)**: `#1A1A22` (Elevated Mobile Card)
- **Primary Text (`text-foreground`)**: `#FFFFFF` / `#18181B`
- **Muted Text (`text-muted-foreground`)**: `#A1A1AA`
- **Hairline Border (`border-border`)**: `#27272A` (Crisp 1px outline)
- **Brand Accent (`bg-primary`)**: `#6E56CF` (Primary Purple) / `#3B82F6` (Electric Blue)

## Typography Matrix (Product Sans / Native System Fonts)
| Token Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 36px | 800 | 1.15 | Screen headers, welcome titles |
| `headline` | 24px | 700 | 1.25 | Card headers, modal titles |
| `subhead` | 18px | 600 | 1.35 | Subtitles, lead copy |
| `body` | 16px | 400 | 1.50 | Default body prose |
| `caption` | 14px | 500 | 1.40 | Metadata, timestamp captions |
| `tiny` | 12px | 600 | 1.30 | Category badges |

## Touch Target & Curvature Tokens
- **Touch Target Height**: Minimum `44px` (`min-h-[44px]`).
- **Touch Target Width**: Minimum `44px` (`min-w-[44px]`).
- **Corner Radii**:
  - Memory Cards: `rounded-2xl` (16px).
  - Modal Sheets: `rounded-t-3xl` (24px).
  - Pill Badges & Buttons: `rounded-full` (9999px).

---

# Part 3: Component Specifications & Registry

## 1. Native Mobile Header (`Header.tsx`)
- Height `56px`, Title left-aligned (`text-lg font-bold`), back gesture icon on left, actions on right.

## 2. Bottom Tab Bar (`(tabs)/_layout.tsx`)
- Fixed height `64px` + bottom safe area inset. Lucide icon + 10px caption text label.

## 3. Memory Card (`Card.tsx`)
- Radius `rounded-2xl`, background `bg-card`, border `1px solid var(--border)`, padding `p-4`, touch feedback `active:opacity-80`.

## 4. Floating Action Import Button (FAB)
- Central circular button (`size 56px`), fixed bottom placement, dedicated to screenshot importing.

---

# Part 4: Responsive Behavior & Layout Rules

- Wrap all screen boundaries with `useSafeAreaInsets()`.
- Use `FlatList` or `FlashList` for memory feeds.
- Maintain text wrapping safety: wrap text nodes inside flex containers with `min-w-0`.
