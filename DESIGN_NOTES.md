# Design Notes

## 1. Design Philosophy

**Goal:** build a calendar that feels familiar but more considered, while exploring what a standalone Warp-adjacent experience could look like.

I evaluated Google Calendar, Apple Calendar, and Notion to lean on well-known patterns, then intentionally departed from Warp’s current app shell/chrome (no global sidebar) to give the calendar room to breathe.

### Guiding principles:

- **Familiarity first** – No new mental models; common calendar behaviors should “just work.”
- **Human-centered** – Highlight the people behind events (avatars, birthdays, time off), not just rows of data.
- **Dense but scannable** – High information density without feeling noisy or overwhelming.

## 2. Visual Design

### Brand & Typography

Warp today feels fairly monochromatic (I dig this by the way) much of its character comes from typography. I pulled your WOFF2s and used **Macan** to keep this aligned with Warp’s brand, while intentionally _not_ recreating the current app layout. The goal was: “Warp sharable standalone calendar” vs. “clone of the existing UI.”

### Color & Theme

- Distinct colors per event type to support quick scanning.
- Soft pastel backgrounds for events to avoid harsh contrast in a dense grid.
- With more time, I’d move toward earthier, calmer tones that feel more mature.
- **Dark mode** is supported and treated as table stakes in 2026, even though I personally default to light mode.

### Event Styling & Emoji

- Events share a consistent, soft background per type; multi-day events keep the same treatment across days for easy tracking.
- Emojis are used in some contexts for familiarity and a bit of personality. I’m aware some teams consider them “less professional,” but for a personal/team calendar, I think they humanize the data. This could easily be made configurable.

## 3. UX Decisions

### Information Hierarchy

- **Primary surface:** monthly grid (who’s out, what’s happening).
- **Secondary surface:** a day-detail surface for deeper inspection.
- The intent is: scan the month quickly, then zoom into a specific day as needed.

### Day Detail Popover

Clicking a day (or “+N more”) opens a popover showing all events grouped by type, with avatars to emphasize the people involved.

Known tension:

- Works well for light/medium density.
- Breaks down when many people are OOO or have birthdays (too visually busy, lots of avatars).

With more time, I’d explore:

- Collapsible sections by event type.
- A right-side drawer that can use more vertical space.
- Smarter avatar stacking/summarization for large groups.

I’m also not fully sold on the popover pattern itself; long-term I could imagine:

- A two-panel layout: clicking a day collapses a sidebar and reveals a richer detail pane.
- Avoiding designs that obscure too much of the calendar grid, since that hurts discoverability.

### “Today” Section

A sidebar “Today” panel gives an at-a-glance view of:

- Who’s out today
- Birthdays / anniversaries
- Key events for the current date

It’s intentionally shallow for this exercise but hints at a direction: a quick status view so you don’t have to parse the entire grid.

### Mini Calendar

The mini calendar mirrors patterns from other tools:

- Rapid navigation to a date without losing context in the main grid.
- Implemented as the same underlying component with a `mini` variant, demonstrating the flexibility of the architecture.
- If it doesn’t prove useful in practice, it can be removed with minimal cost.

### Navigation

- Chevron arrows for month-to-month navigation.
- “Today” button to jump back to the current date.
- Mini calendar for direct date selection.

### Filtering

Filtering by event type (Time Off, Birthday, Anniversary, Company Event, Deadline) is available and, in my opinion, is **table stakes**, not just a bonus feature. It’s important for:

- Quickly answering questions like “who’s out this week?” or “what deadlines are coming up?”
- Managing data density without hiding important information.

Counts per filter give a quick sense of how “busy” each category is in the current view.

## 4. Handling Complex Scenarios

### Multi-Day Events

- The grid is processed week-by-week.
- Multi-day events are absolutely positioned:
  - Percentage-based CSS for horizontal placement.
  - Fixed pixel offsets for vertical stacking.

### Overlapping Events & Data Density

- Events stack vertically within a day cell.
- When a day has too many events, a “+N more” overflow link appears.
- Clicking “+N more” (or the day) opens the full list in the day-detail popover.

This keeps the month view scannable while preserving access to complete detail, especially during peak periods like December (holidays + lots of time off).

## 5. Technical Architecture

### Styling

- **Tailwind CSS** for rapid iteration and colocated styling.
- Design tokens are expressed via utility classes for consistency and speed.

### Date Handling

- **date-fns** for all date math, formatting, and comparisons.
- Lightweight and tree-shakeable, appropriate for this kind of UI.

### Component Library: shadcn + Ariakit

- Followed **shadcn**’s component patterns (menus, buttons, avatars, etc.).
- Replaced **Radix** primitives with **Ariakit** equivalents:
  - The community has raised concerns about WorkOS’s investment in Radix’s future.
  - I’ve been building shadcn-compatible components powered by Ariakit to avoid that dependency.
- This calendar served as a low-risk proving ground for that work:
  - APIs and DX feel like shadcn.
  - Under the hood, primitives are Ariakit.
  - Plan: open-source this as a shadcn-style component registry once it’s more stable.

### State Management

- Pure **React state + context**:
  - A CalendarContext provider holds shared state.
  - A `useCalendar` hook exposes this state and actions to any consuming component (main grid, mini calendar, “Today” panel, filters, etc.).
- This keeps the architecture simple and dependency-light while still being composable. In a larger app, something like Zustand could be layered in if needed.

### Calendar Component Architecture

- One flexible calendar component supports:
  - Full monthly grid (main view).
  - Mini calendar (sidebar).
- Props configure variant and behavior instead of duplicating logic.
- This ensures consistent behavior and keeps future changes (e.g., keyboard support, new views) centralized.

## 6. Trade-offs, Constraints & Known Issues

### Prioritized

- Visual feel and brand alignment.
- Multi-day event rendering.
- Event-type filtering.
- Light/dark/system theming.
- Timezone selection.
- The “Today” at-a-glance concept.

### Cut / Not Implemented

- **Add/edit event flows** – Stretch goal I consciously dropped for time.
- **Keyboard navigation** – No arrow-key navigation or shortcuts implemented yet.
- **Accessibility** – Only minimal ARIA; no full keyboard/screen reader pass.
- **Mobile** – Desktop-first; no responsive layouts.

### Known Issues

- Some Ariakit integration bugs from the experimental component registry.
- Avatar-heavy days (e.g., lots of time off) can feel noisy and less useful.
- Event stacking and priority ordering are simplistic.
- Minor alignment/spacing issues in the grid.
- Some icons don’t yet pull their weight; may be better suited to the filter/header area than inside the day view.
- Event description field from the API is not surfaced; in reality this is useful for context (e.g., trip details, personal notes).

## 7. Timezones & Global Use

- Supports: System, Eastern, Central, Mountain, Pacific, Alaska, Hawaii.
- Changing the timezone updates event times accordingly while preserving the underlying schedule.
- This intentionally **does not** attempt to expose the full 400+ IANA timezones for the exercise.
- In a real product, the key challenge is **discoverability** and selection of a long list (grouping by region, intelligent defaults, recent timezones, etc.).

## 8. Accessibility & Keyboard Navigation (Future)

Accessibility is important to me, but it wasn’t fully addressed here due to time.

Planned improvements:

- Keyboard navigation in the grid (arrow keys to move between days, Enter/Space to open a day).
- Shortcut keys (e.g., `T` to jump to Today).
- Proper semantic markup, ARIA roles, and labels for:
  - Calendar structure (grid, row, column, cell semantics).
  - Popovers/drawers.
  - Menus and filters.
- Screen reader-friendly announcements when the month or selection changes.

## 9. Bonus Features Implemented

- ✅ **Advanced filtering** by event type with counts.
- ✅ **Theme support**: Light, Dark, System.
- ✅ **Timezone selection**: System, ET, CT, MT, PT, Alaska, Hawaii.
- ❌ **Google Calendar sync UI**.
- ❌ **Smart conflict detection**.
- ❌ **Full accessibility pass**.

## 10. Future Work

### If I Had More Time

- Add/edit event flows (modal or slide-over).
- Replace/augment the day popover with a right-side drawer or two-panel layout.
- Refine avatar density (stacking, collapsing, summarizing).
- Implement keyboard navigation and shortcuts.
- Full accessibility audit and ARIA implementation.
- Refine the color system toward calmer, more brand-aligned tones.
- Smarter event stacking/prioritization (all-day first, important events surfaced).
- Recurring event support.

### Longer-Term Ideas

- Week/day views in addition to month.
- Drag-and-drop event editing.
- Google Calendar sync UI with granular control per event type.
- Conflict detection when scheduling over someone’s time off.
- Team-based filters (e.g., “my immediate team” vs entire org).
- Search for people, events, and time ranges.
