# Zenix Design System Specification — Mobile App Blueprint

Design tokens, color surfaces, touch target standards, and component specifications for ScribbleBox Mobile.

---

# 1. Design Tokens & Layout Safety Rules

1. **Text-Wrapping Safety**:
   - Wrap text nodes inside flex items with proper padding and container bounds.
   - Maintain body copy readable measure (45–75 characters per line).
   - Use `overflow-wrap: break-word` for non-standard text.

2. **Typography**:
   - Product Sans / System font for clear legibility on mobile viewports.

3. **Color Palette Tokens**:
   - **Canvas (`bg-background`)**: `#0F0F12` (Dark Obsidian) / `#FAFAFA` (Clean Light)
   - **Card Surface (`bg-card`)**: `#1A1A22` (Elevated Surface)
   - **Primary Text (`text-foreground`)**: `#FFFFFF` / `#18181B`
   - **Border (`border-border`)**: `#27272A`
   - **Brand Accent (`bg-primary`)**: `#3B82F6` (Electric Blue)

---

# 2. Touch Target & Mobile Accessibility Rules

- Minimum Touch Height: `44px` (`min-h-[44px]`).
- Minimum Touch Width: `44px` (`min-w-[44px]`).
- Touch Feedback: Always apply `active:opacity-75` or `active:scale-98` to touchable components.

---

# 3. Mobile Component Specs

## Header Component (`Header.tsx`)
- Height `56px`, Title left-aligned with `text-lg font-bold`, back gesture icon on left.

## Bottom Tab Bar (`(tabs)/_layout.tsx`)
- Height `64px` + bottom safe area. Lucide icon + small title label.

## Memory Card (`Card.tsx`)
- Radius `rounded-2xl`, background `bg-card`, border `1px solid var(--border)`, padding `p-4`.
