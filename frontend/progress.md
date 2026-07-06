## Completed

- **AnimatedForm restored** to original decorative-only version (animated staggered text, checkmark circles, Google overlay)
- **Auth inputs replaced** with shadcn `Input` component using polished styling:
  - `rounded-xl` (12px) instead of `rounded-none` default — balanced, not over-rounded
  - `bg-card` background matching forgeui card aesthetic
  - `h-12` for comfortable touch targets
  - Icons absolutely positioned with `left-4` offset inside `relative` wrapper
  - Controlled state via React `useState` for all fields
  - Password eye toggle positioned at `right-4`
- Login: email + password fields with separate labels
- Signup: name + username in 2-column grid, email, password — each with label

## Current status

Auth forms use shadcn Input with polished forgeui-inspired styling. AnimatedForm remains as decorative element above the form.

## Pending

- n/a

## Next tasks

- n/a
