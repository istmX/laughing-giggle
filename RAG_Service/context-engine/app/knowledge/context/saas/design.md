# Zenix Design System Specification — Full-Stack SaaS Blueprint

Single source of truth for UI components, tokens, layout safety, and color systems in ScribbleBox SaaS.

---

# 1. Design Principles & Layout Safety Rules

1. **Text-Wrapping Safety**:
   - Never let flex/grid text containers shrink-to-fit unintentionally. Use `w-full min-w-0` on wrappers.
   - Maintain body prose readable width (45–75 characters per line).
   - Use `overflow-wrap: break-word` (reserve `anywhere` only for long unbroken URLs).

2. **Typography**:
   - Product Sans font family for body, headings, buttons, and navigation.
   - Distinct editorial hierarchy without random font size overrides.

3. **Color Tokens**:
   - Dark Mode Surface (`--bg-canvas`): `#09090B` (Slate Obsidian)
   - Light Mode Surface (`--bg-canvas`): `#FFFFFF` (Pure White)
   - Sidebar Surface (`--bg-sidebar`): `#18181B` (240px Fixed Sidebar)
   - Primary Accent (`--primary`): `#3B82F6` (Electric Blue) / `#6366F1` (Indigo)
   - Hairline Border (`--border`): `#27272A` / Light hairline `#E4E4E7`

---

# 2. SaaS Dashboard Component Registry

## Sidebar Navigation (`Sidebar.tsx`)
- Fixed width `240px`, height `100vh`. Brand logo at top, navigation item stack, user profile avatar at bottom.

## Data Table (`DataTable.tsx`)
- Dense row padding `py-3 px-4`, search input bar with debounced query hook, column sorting, pagination controls.

## Metric Cards (`MetricCard.tsx`)
- Elevated surface `bg-surface-elevated`, hairline border, prominent metric count (`text-2xl font-bold`), trend badge (`+14.2%`).

## Reusable Action Buttons (`Button.tsx`)
- Shared button component utilizing `--primary` tokens, hover micro-interactions, and accessible loading spinner states.
