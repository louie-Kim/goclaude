# Design: FigmaCaptureButton Multi-Select (Ctrl+Click + Drag Area)

## Overview

Extends `FigmaCaptureButton.tsx` to support multi-element selection via two new interaction methods while preserving all existing single-select behavior and action functions unchanged.

**Target File**: `src/app/saas-dashboard/FigmaCaptureButton.tsx`

---

## Functional Requirements

### FR-1: Ctrl+Click Multi-Accumulation
- Ctrl+Click (or Meta+Click on Mac) accumulates elements while staying in picking mode
- Each accumulated element gets a numbered badge highlight (`__cap_hl_multi__`)
- Toolbar shows `{N}개 선택 — Ctrl+클릭으로 추가` when count > 0
- A "완료" button confirms the accumulated selection
- Plain click (no modifier) retains exact original behavior (single select)

### FR-2: Drag Area Selection
- Left-button drag draws a dashed rectangle overlay (visual feedback)
- On mouse-up: collects all elements whose bounding-rect center is inside the drag rect
- Filters out body/html/figma/cap_hl elements
- Keeps only outermost elements (removes descendants)
- If 1 element found → treated as single select (original behavior)
- If 0 elements found → stay in picking, no state change
- If ≥2 elements found → multi-select mode

### FR-3: Drag visual overlay
- Dashed `#818cf8` border, semi-transparent fill, `zIndex: 99991`
- Rendered as fixed position div, `pointerEvents: none`
- Disappears on mouse-up

### FR-4: Multi-select highlight badges
- Class `__cap_hl_multi__` for easy cleanup
- Solid `#818cf8` border (vs dashed for hover)
- Numbered circular badge (1-indexed) at top-left corner

### FR-5: Suppress click after drag
- `dragJustEndedRef` flag prevents the synthetic click event from firing after mouseup

### FR-6: Picking mode toolbar update
- When `sels.length > 0`: show count + "완료" button
- When `sels.length === 0`: show original "캡처할 요소를 클릭하세요"
- Cancel button always visible

### FR-7: Selected mode toolbar update
- Label: `{N}개 선택됨` when `sels.length > 1`, else single `sel.label`
- "클립보드에 복사" → calls `copyMultiToClipboard` when multi, `copyToClipboard` when single
- "Figma로 보내기" → calls `sendMultiToFigma` when multi, `sendToFigma` when single
- "다시 선택" and cancel buttons unchanged

### FR-8: Multi-select action handlers
- `copyMultiToClipboard`:
  - Guard: `!window.figma?.captureForDesign` → error toast (NOT `!window.figma` which passes `{}`)
  - Find common ancestor of all selected elements via `getCommonAncestor()`
  - Single `captureForDesign({ selector: getCssSelector(container) })` call (no sequential overwrite)
  - Wrapped in try/catch with error toast
  - toast with count on success
- `sendMultiToFigma`:
  - Guard: `!window.figma?.captureForDesign` → error toast
  - Sequential `captureForDesign` loop per element (plugin mode sends directly, no overwrite issue)
  - toast with count on success

### FR-8a: `getCommonAncestor` helper (module-level)
- Finds the lowest common ancestor element that contains all selected elements
- Signature: `getCommonAncestor(elements: Element[]): Element`
- Returns single element if only one in array
- Walks up DOM tree until node contains all elements
- Falls back to `document.body` if no common ancestor found

### FR-8b: Null check for `captureForDesign`
- All 4 action handlers must use `!window.figma?.captureForDesign` guard
- NOT `!window.figma` (which passes when `window.figma = {}` causing silent TypeError)

### FR-9: Zero-change constraint
- `copyToClipboard` — byte-for-byte unchanged
- `sendToFigma` — byte-for-byte unchanged
- `FIGMA_URL` constant — unchanged
- All icon components — unchanged

### FR-10: Escape key and cancel reset
- `cancel()` resets `sels`, `dragRect`, calls `removeAllSelHL()`
- Escape key triggers `cancel()` as before
- "다시 선택" in selected mode resets to fresh picking state

---

## State & Refs

| Name | Type | Purpose |
|------|------|---------|
| `sels` | `Sel[]` | Multi-select accumulation list |
| `dragRect` | `{x,y,w,h}\|null` | Current drag rectangle for overlay |
| `selsRef` | `useRef<Sel[]>` | Mirror of `sels` for event callbacks |
| `dragStartRef` | `useRef<{x,y}\|null>` | Drag start point |
| `isDragRef` | `useRef<boolean>` | Whether current mousedown became a drag |
| `dragJustEndedRef` | `useRef<boolean>` | Flag to suppress post-drag click |

---

## New Event Handlers

| Handler | Trigger | Behavior |
|---------|---------|---------|
| `onMouseDown` | mousedown (capture) | Record drag start |
| `onMouseMove` | mousemove (capture) | Update drag rect overlay |
| `onMouseUp` | mouseup (capture) | Complete drag, collect elements |
| Modified `onClickEl` | click (capture) | Ctrl branch vs plain branch |

All new handlers registered/unregistered in `startPick`/`removePick`.

---

## New Module-Level Helpers

- `addSelHL(el, idx)` — create numbered badge overlay div
- `removeAllSelHL()` — remove all `.` + `HL_MULTI_CLASS` divs
- `getElementsInRect(x1, y1, x2, y2)` — grid sample → center filter → outermost filter → `Sel[]`

---

## Verification Scenarios

| # | Scenario | Expected |
|---|----------|----------|
| V1 | Plain click | Single select, original behavior unchanged |
| V2 | Ctrl+click × 3 | 3개 선택, 완료 → 3개 선택됨 |
| V3 | Drag over 2+ cards | N개 선택됨 |
| V4 | Drag over 0 elements | Stay in picking |
| V5 | Escape mid-drag | Cancel, no selection |
| V6 | 다시 선택 | Fresh picking state |
| V7 | `copyToClipboard` unchanged | Single-sel copy works |
| V8 | `sendToFigma` unchanged | Single-sel send works |
