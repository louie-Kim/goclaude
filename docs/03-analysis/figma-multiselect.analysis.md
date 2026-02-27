# figma-multiselect Analysis Report (v2 -- Clipboard Overwrite Bug Fix)

> **Analysis Type**: Gap Analysis (Design vs Implementation) -- Bug Fix Focus
>
> **Project**: blogposter
> **Analyst**: Claude (gap-detector)
> **Date**: 2026-02-27
> **Design Doc**: [figma-multiselect.design.md](../02-design/features/figma-multiselect.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Re-verify the multi-select feature implementation after the clipboard overwrite bug fix. The design document now includes FR-8a (`getCommonAncestor` helper) and FR-8b (correct `captureForDesign` null guard), and FR-8 `copyMultiToClipboard` has been redesigned to use a single `captureForDesign` call with a common ancestor selector instead of a sequential loop.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/figma-multiselect.design.md`
- **Implementation Path**: `src/app/saas-dashboard/FigmaCaptureButton.tsx`
- **Analysis Date**: 2026-02-27
- **Focus**: Clipboard overwrite bug fix (FR-8, FR-8a, FR-8b)

---

## 2. Bug Fix Focal Point Analysis

### 2.1 FR-8a: `getCommonAncestor` Module-Level Helper

| Requirement | Design (line ref) | Implementation (line ref) | Status |
|-------------|-------------------|---------------------------|--------|
| Module-level function (not inside component) | FR-8a | Lines 100-108, outside `FigmaCaptureButton()` | PASS |
| Signature: `(elements: Element[]): Element` | FR-8a | `function getCommonAncestor(elements: Element[]): Element` | PASS |
| Returns single element when array length is 1 | FR-8a | `if (elements.length === 1) return elements[0];` (line 101) | PASS |
| Walks up DOM via `parentElement` | FR-8a | `node = node.parentElement` (line 105) | PASS |
| Checks `contains()` for all elements | FR-8a | `elements.every(el => node!.contains(el))` (line 104) | PASS |
| Falls back to `document.body` | FR-8a | `return document.body;` (line 107) | PASS |

**Logic correctness**: The implementation starts from `elements[0].parentElement` and walks upward, checking at each level whether the candidate node contains ALL elements. This is the standard lowest-common-ancestor algorithm for DOM nodes. It correctly handles: single element (early return), siblings (finds parent), distant cousins (walks up until common container), and worst case (returns `document.body`).

### 2.2 FR-8b: `!window.figma?.captureForDesign` Guard in ALL 4 Handlers

| Handler | Design Requirement | Implementation Guard | Line | Status |
|---------|-------------------|---------------------|------|--------|
| `copyToClipboard` (single) | `!window.figma?.captureForDesign` | `if (!window.figma?.captureForDesign)` | 367 | PASS |
| `sendToFigma` (single) | `!window.figma?.captureForDesign` | `if (!window.figma?.captureForDesign)` | 390 | PASS |
| `copyMultiToClipboard` (multi) | `!window.figma?.captureForDesign` | `if (!window.figma?.captureForDesign)` | 435 | PASS |
| `sendMultiToFigma` (multi) | `!window.figma?.captureForDesign` | `if (!window.figma?.captureForDesign)` | 453 | PASS |

All 4 handlers use the correct optional chaining guard `?.captureForDesign` instead of the buggy `!window.figma` pattern. This prevents the silent TypeError when `window.figma = {}` (empty object without `captureForDesign` method).

### 2.3 FR-8 `copyMultiToClipboard`: Single `captureForDesign` Call (No Loop)

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| Find common ancestor | `getCommonAncestor()` call | `const container = getCommonAncestor(sels.map(s => s.el));` (line 439) | PASS |
| Single `captureForDesign` call | One call with container selector | `window.figma.captureForDesign({ selector: getCssSelector(container) })` (line 441) | PASS |
| NO sequential loop | Must not iterate over `sels` | No `for` loop, no `.forEach`, no `.map` calling `captureForDesign` | PASS |
| try/catch wrapper | Wrapped in try/catch | `try { ... } catch { showToast("...") }` (lines 438-448) | PASS |
| Toast with count on success | Toast showing count | `showToast(\`...\${sels.length}...\`)` (line 444) | PASS |

**Bug fix verified**: The previous implementation used a sequential `for` loop calling `captureForDesign` per element, which caused each call to overwrite the clipboard. The current implementation captures a single common ancestor container, ensuring all selected elements appear in one clipboard capture.

### 2.4 FR-8 `sendMultiToFigma`: Still Uses Loop (Correct)

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| Sequential loop per element | Loop is OK for plugin mode | `for (const s of sels) { ... }` (line 460) | PASS |
| Individual `captureForDesign` per element | Each element sent separately | `captureForDesign({ selector: s.selector })` (lines 463-464) | PASS |

Plugin mode sends directly to Figma (no clipboard), so sequential calls are correct behavior here.

---

## 3. Full Functional Requirements Check (FR-1 through FR-10)

| FR | Requirement | Implementation Lines | Status |
|----|-------------|---------------------|--------|
| FR-1 | Ctrl+Click multi-accumulation | `onClickEl` lines 249-256 | PASS |
| FR-2 | Drag area selection | `onMouseDown/Move/Up` lines 269-323, `getElementsInRect` lines 110-142 | PASS |
| FR-3 | Drag visual overlay | Render block lines 550-566 (dashed #818cf8, zIndex 99991, fixed, pointerEvents none) | PASS |
| FR-4 | Multi-select highlight badges | `addSelHL` lines 71-93 (HL_MULTI_CLASS, solid border, numbered badge) | PASS |
| FR-5 | Suppress click after drag | `dragJustEndedRef` line 194, set line 298, check line 244 | PASS |
| FR-6 | Picking mode toolbar | Lines 490-508 (count message when sels>0, original when sels==0, cancel visible) | PASS |
| FR-7 | Selected mode toolbar | Lines 512-536 (N-count vs single label, multi/single routing, re-select + cancel) | PASS |
| FR-8 | Multi-select actions | `copyMultiToClipboard` lines 434-449 (common ancestor, single call), `sendMultiToFigma` lines 451-476 (loop) | PASS |
| FR-8a | `getCommonAncestor` helper | Lines 100-108 (module-level, correct LCA algorithm) | PASS |
| FR-8b | `captureForDesign` null guard | Lines 367, 390, 435, 453 (all 4 handlers) | PASS |
| FR-9 | Zero-change constraint | `copyToClipboard` lines 365-381, `sendToFigma` lines 384-431, `FIGMA_URL` line 17-18, Icons lines 150-175 | PASS |
| FR-10 | Escape key and cancel reset | `cancel` lines 338-343, `onKey` lines 225-227, re-select line 533 | PASS |

---

## 4. State & Refs

| Name | Design Type | Implementation | Line | Status |
|------|-------------|----------------|------|--------|
| `sels` | `Sel[]` | `useState<Sel[]>([])` | 183 | PASS |
| `dragRect` | `{x,y,w,h}\|null` | `useState<{x:number;y:number;w:number;h:number}\|null>(null)` | 186 | PASS |
| `selsRef` | `useRef<Sel[]>` | `useRef<Sel[]>([])` | 190 | PASS |
| `dragStartRef` | `useRef<{x,y}\|null>` | `useRef<{x:number;y:number}\|null>(null)` | 192 | PASS |
| `isDragRef` | `useRef<boolean>` | `useRef(false)` | 193 | PASS |
| `dragJustEndedRef` | `useRef<boolean>` | `useRef(false)` | 194 | PASS |

---

## 5. Missing Features (Design exists, Implementation missing)

None found.

---

## 6. Added Features (Implementation exists, Design missing)

| Item | Implementation Location | Description | Impact |
|------|------------------------|-------------|--------|
| `sendMultiToFigma` captureId/endpoint dual-path | Lines 457-458, 462-464 | Handles both direct-send and clipboard-fallback paths per element, matching `sendToFigma` dual-path pattern | Low (enhancement, consistent with single-select) |
| Hover HL suppression during drag | Line 220 in `onOver`, line 285 in `onMouseMove` | Prevents hover highlight from appearing while user is dragging | Low (UX polish, logical behavior) |

These are minor implementation details that enhance the user experience without contradicting any design specification.

---

## 7. Changed Features (Design differs from Implementation)

None found. All design specifications are implemented as described.

---

## 8. Convention Compliance

### 8.1 Naming Convention

| Category | Convention | Status |
|----------|-----------|--------|
| Component | PascalCase (`FigmaCaptureButton`) | PASS |
| Functions | camelCase (`startPick`, `getCommonAncestor`, `copyMultiToClipboard`) | PASS |
| Constants | UPPER_SNAKE_CASE (`HL_ID`, `HL_MULTI_CLASS`, `FIGMA_URL`, `SAFE`) | PASS |
| Types | PascalCase (`Mode`, `Toast`, `Sel`) | PASS |
| File | PascalCase.tsx (`FigmaCaptureButton.tsx`) | PASS |

### 8.2 Import Order

- [x] External libraries first (react: line 3)
- N/A Internal absolute imports (single file, none needed)
- N/A Relative imports (none)
- N/A Type imports (none separate)
- N/A Styles (none imported)

---

## 9. Match Rate Summary

```
+-----------------------------------------------+
|  Overall Match Rate: 100%                      |
+-----------------------------------------------+
|  Bug Fix Items (FR-8, FR-8a, FR-8b):  7/7     |
|  Original FRs (FR-1 to FR-10):       12/12    |
|  State & Refs:                         6/6     |
|  Event Handlers:                       4/4     |
|  Module-Level Helpers:                 4/4     |
|  Zero-Change Constraints:              4/4     |
+-----------------------------------------------+
```

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 100% | PASS |
| Bug Fix Compliance | 100% | PASS |
| Convention Compliance | 100% | PASS |
| **Overall** | **100%** | **PASS** |

---

## 10. Recommended Actions

### 10.1 Immediate

No immediate actions required. The clipboard overwrite bug fix is fully implemented as designed.

### 10.2 Design Document Updates (Optional)

| Item | Description | Priority |
|------|-------------|----------|
| Hover HL suppression during drag | `onOver` skips when `isDragRef.current` is true; `onMouseMove` calls `removeHL()` | Low |
| `sendMultiToFigma` dual-path logic | Mirrors `sendToFigma` captureId/endpoint fallback pattern | Low |

---

## 11. Next Steps

- [x] Gap analysis complete -- Match Rate 100%
- [x] Clipboard overwrite bug fix verified
- [x] All 4 handlers use correct `captureForDesign` null guard
- [x] `getCommonAncestor` logic verified correct
- [ ] Manual QA testing of all 8 verification scenarios (V1-V8)
- [ ] Generate completion report (`/pdca report figma-multiselect`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-27 | Initial gap analysis | Claude (gap-detector) |
| 2.0 | 2026-02-27 | Re-analysis with clipboard overwrite bug fix focus (FR-8, FR-8a, FR-8b) | Claude (gap-detector) |
