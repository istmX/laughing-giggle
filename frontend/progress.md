## Completed

- **Auth pages redesigned** into a centered split-screen layout that matches the login reference more closely:
  - dark editorial left panel with centered hero copy
  - bordered right-side card with centered form heading
  - mobile brand header so the shell still reads well on small screens
- **Shared auth field component added** for login and signup:
  - typing pulse animation on `onChange`
  - password visibility toggle
  - consistent icon + label layout
- **Shared social auth section added** for the Google sign-in row and divider
- **Login and signup forms cleaned up**:
  - removed the legacy decorative AnimatedForm block
  - kept auth logic intact
  - navigation now only happens after a successful auth response
- **Password toggle logic fixed** so the eye icon now actually reveals and hides the password value

## Current status

Auth forms now use a shared dark shell, centered heading treatment, and input-level motion that matches the reference more closely.

## Pending

- n/a

## Next tasks

- n/a
