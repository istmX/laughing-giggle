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

Landing page work is now underway on the `/` route.

The home page now includes:
- a rebuilt dark landing-page shell instead of a single placeholder hero
- GSAP plugin setup plus Lenis smooth scrolling with reduced-motion fallback
- an animated split-style hero with staged nav, heading, copy, and CTA entrance motion
- an AI agent marquee section
- a storytelling flow section
- a pinned horizontal document showcase powered by `ScrollTrigger`
- a generated-context bento section
- a context assembly / workflow section
- a closing CTA band

## Pending

- **Landing page foundation**
  - refine section spacing, pacing, and visual transitions after the first full-page pass
  - keep extracting repeated patterns into smaller reusable landing primitives where it improves clarity

- **Hero rebuild**
  - polish the hero typography so it lands even closer to the provided reference image
  - replace the current custom split-style reveal with `split-type` or GSAP `SplitText` if installed
  - add richer CTA interaction details such as magnetic hover if it improves feel without becoming gimmicky
  - evaluate whether the hero needs additional ambient SVG motion or starfield detail

- **Brand storytelling sections**
  - replace the current AI tool initials with official monochrome SVG logos
  - make the story and assembly sections feel more bespoke with stronger line animation and relationship cues
  - push the bento section further so each tile feels more unique and less like a shared card system

- **Horizontal document experience**
  - tune the pinned horizontal section for smaller screens and longer scroll sessions
  - add more refined panel-specific motion and visual detail inside each document panel

- **Animation system requirements**
  - continue aligning section motion with `Animations.md`, especially reveal, stagger, orchestration, and scroll-driven pacing
  - extend reduced-motion handling to any new ambient effects added in later passes

- **Dependency gap**
  - install `split-type` unless a licensed GSAP `SplitText` plugin is already available locally
  - no additional package is currently required for `gsap`, `@gsap/react`, `ScrollTrigger`, or `lenis` because they are already present
  - React Bits does not need an npm package here if we reuse or adapt components through the existing registry workflow

- **Verification**
  - review the landing page in-browser on desktop and mobile breakpoints
  - verify pinned horizontal scrolling does not trap users on smaller screens
  - confirm marquee, hero reveals, and smooth scrolling stay performant
  - watch bundle size if more animation or logo assets are added

## Next tasks

- install `split-type` if you want the hero text split animation upgraded from the current custom span-based version
- replace placeholder AI tool glyphs with official monochrome SVG logos
- refine the hero and section art direction against the design reference in a second visual pass
