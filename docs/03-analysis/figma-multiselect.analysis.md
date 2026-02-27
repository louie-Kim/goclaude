# figma-multiselect Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: blogposter
> **Analyst**: Claude (gap-detector)
> **Date**: 2026-02-27
> **Design Doc**: [figma-multiselect.design.md](../02-design/features/figma-multiselect.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Verify that the multi-select feature implementation in `FigmaCaptureButton.tsx` fully matches the design document `figma-multiselect.design.md` across all 10 functional requirements, state/refs, event handlers, helper functions, and UI elements.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/figma-multiselect.design.md`
- **Implementation Path**: `src/app/saas-dashboard/FigmaCaptureButton.tsx`
- **Analysis Date**: 2026-02-27

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Functional Requirements

| FR | Requirement | Implementation Location | Status | Notes |
|----|-------------|------------------------|--------|-------|
| FR-1 | Ctrl+Click multi-accumulation | `onClickEl` L239-246 | ✅ Match | Ctrl/Meta check, accumulate to `sels`, `addSelHL`, stay in picking |
| FR-2 | Drag area selection | `onMouseDown/Move/Up` L259-313, `getElementsInRect` L100-132 | ✅ Match | Grid sample, center filter, outermost filter, 0/1/>=2 branching |
| FR-3 | Drag visual overlay | Render block L528-543 | ✅ Match | Dashed #818cf8, zIndex 99991, fixed, pointerEvents none |
| FR-4 | Multi-select highlight badges | `addSelHL` L71-93, `removeAllSelHL` L95-97 | ✅ Match | HL_MULTI_CLASS, solid border, numbered badge at top-left |
| FR-5 | Suppress click after drag | `dragJustEndedRef` L184, set L288, check L234 | ✅ Match | setTimeout(0) clear pattern |
| FR-6 | Picking mode toolbar update | Render block L467-486 | ✅ Match | Count + message when sels>0, original message when sels==0, cancel always visible |
| FR-7 | Selected mode toolbar update | Render block L488-513 | ✅ Match | N-count label vs single label, multi/single action routing, "다시 선택" + cancel |
| FR-8 | Multi-select action handlers | `copyMultiToClipboard` L416-426, `sendMultiToFigma` L428-453 | ✅ Match | Sequential loop, toast with count |
| FR-9 | Zero-change constraint | `copyToClipboard` L347-363, `sendToFigma` L366-413, `FIGMA_URL` L18, Icons L140-165 | ✅ Match | All original functions byte-for-byte preserved |
| FR-10 | Escape key and cancel reset | `cancel` L328-333, `onKey` L215-217, `startPick` L315-326 | ✅ Match | Resets sels, dragRect, removeAllSelHL; "다시 선택" calls startPick |

### 2.2 State & Refs

| Name | Design Type | Implementation | Location | Status |
|------|-------------|----------------|----------|--------|
| `sels` | `Sel[]` | `useState<Sel[]>([])` | L173 | ✅ |
| `dragRect` | `{x,y,w,h}\|null` | `useState<{x:number;y:number;w:number;h:number}\|null>(null)` | L176 | ✅ |
| `selsRef` | `useRef<Sel[]>` | `useRef<Sel[]>([])` | L180 | ✅ |
| `dragStartRef` | `useRef<{x,y}\|null>` | `useRef<{x:number;y:number}\|null>(null)` | L182 | ✅ |
| `isDragRef` | `useRef<boolean>` | `useRef(false)` | L183 | ✅ |
| `dragJustEndedRef` | `useRef<boolean>` | `useRef(false)` | L184 | ✅ |

### 2.3 New Event Handlers

| Handler | Design Trigger | Implementation | Registered in startPick | Removed in removePick | Status |
|---------|---------------|----------------|:-----------------------:|:---------------------:|--------|
| `onMouseDown` | mousedown (capture) | L259-264 | L321 | L224 | ✅ |
| `onMouseMove` | mousemove (capture) | L266-276 | L322 | L225 | ✅ |
| `onMouseUp` | mouseup (capture) | L278-313 | L323 | L226 | ✅ |
| Modified `onClickEl` | click (capture) | L231-257 (Ctrl branch + plain branch) | L324 | L227 | ✅ |

### 2.4 Module-Level Helpers

| Helper | Design Description | Implementation | Location | Status |
|--------|--------------------|----------------|----------|--------|
| `addSelHL(el, idx)` | Numbered badge overlay div | Creates fixed div with HL_MULTI_CLASS, solid border, numbered badge | L71-93 | ✅ |
| `removeAllSelHL()` | Remove all multi-HL divs | querySelectorAll + remove | L95-97 | ✅ |
| `getElementsInRect(x1,y1,x2,y2)` | Grid sample, center filter, outermost, return Sel[] | Full implementation with all filters | L100-132 | ✅ |

### 2.5 New Component Functions

| Function | Design | Implementation | Location | Status |
|----------|--------|----------------|----------|--------|
| `handleCtrlDone` | Confirm accumulated Ctrl selection | Sets sel to first, transitions to selected mode | L335-342 | ✅ |
| `copyMultiToClipboard` | Sequential captureForDesign loop, toast with count | Loop with Promise.race, toast with `${sels.length}개` | L416-426 | ✅ |
| `sendMultiToFigma` | Sequential captureForDesign loop, toast with count | Loop with Promise.race, captureId/endpoint handling, toast | L428-453 | ✅ |

### 2.6 Match Rate Summary

```
+---------------------------------------------+
|  Overall Match Rate: 100%                    |
+---------------------------------------------+
|  Functional Requirements:  10/10  (100%)     |
|  State & Refs:              6/6   (100%)     |
|  Event Handlers:            4/4   (100%)     |
|  Module-Level Helpers:      3/3   (100%)     |
|  Component Functions:       3/3   (100%)     |
|  Zero-Change Constraints:   4/4   (100%)     |
+---------------------------------------------+
```

---

## 3. Missing Features (Design exists, Implementation missing)

None found.

---

## 4. Added Features (Implementation exists, Design missing)

| Item | Implementation Location | Description | Impact |
|------|------------------------|-------------|--------|
| `sendMultiToFigma` captureId/endpoint logic | L434-435, L439-442 | Handles both direct-send and clipboard-fallback paths per element, matching `sendToFigma` dual-path pattern | Low (enhancement, consistent with single-select) |
| Hover HL suppression during drag | L210 in `onOver`, L275 in `onMouseMove` | Prevents hover highlight from appearing while user is dragging | Low (UX polish, not in design but logical) |

These are minor implementation details that enhance the user experience without contradicting any design specification.

---

## 5. Changed Features (Design differs from Implementation)

None found. All design specifications are implemented as described.

---

## 6. Convention Compliance

### 6.1 Naming Convention Check

| Category | Convention | Status | Notes |
|----------|-----------|--------|-------|
| Component | PascalCase (`FigmaCaptureButton`) | ✅ | |
| Functions | camelCase (`startPick`, `removePick`, `handleCtrlDone`) | ✅ | |
| Constants | UPPER_SNAKE_CASE (`HL_ID`, `HL_MULTI_CLASS`, `FIGMA_URL`, `SAFE`) | ✅ | |
| Types | PascalCase (`Mode`, `Toast`, `Sel`) | ✅ | |
| File | PascalCase.tsx (`FigmaCaptureButton.tsx`) | ✅ | |

### 6.2 Import Order Check

- [x] External libraries first (react: L3)
- N/A Internal absolute imports (none needed -- single file)
- N/A Relative imports (none)
- N/A Type imports (none separate)
- N/A Styles (none imported)

---

## 7. Verification Scenarios Readiness

| # | Scenario | Implementation Support | Status |
|---|----------|----------------------|--------|
| V1 | Plain click | `onClickEl` plain branch L247-256 | ✅ Ready |
| V2 | Ctrl+click x 3 | `onClickEl` Ctrl branch L239-246, `handleCtrlDone` L335-342 | ✅ Ready |
| V3 | Drag over 2+ cards | `onMouseUp` L306-312, `getElementsInRect` L100-132 | ✅ Ready |
| V4 | Drag over 0 elements | `onMouseUp` L292 returns early | ✅ Ready |
| V5 | Escape mid-drag | `cancel` L328-333 resets dragRect | ✅ Ready |
| V6 | "다시 선택" | `startPick` L315-326 resets all state | ✅ Ready |
| V7 | copyToClipboard unchanged | L347-363 preserved | ✅ Ready |
| V8 | sendToFigma unchanged | L366-413 preserved | ✅ Ready |

---

## 8. Overall Score

```
+---------------------------------------------+
|  Overall Score: 100/100                      |
+---------------------------------------------+
|  Design Match:          100%                 |
|  State & Refs:          100%                 |
|  Event Handlers:        100%                 |
|  Helpers & Functions:   100%                 |
|  UI / Toolbar:          100%                 |
|  Zero-Change:           100%                 |
|  Convention:            100%                 |
+---------------------------------------------+
```

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 100% | PASS |
| Architecture Compliance | 100% | PASS |
| Convention Compliance | 100% | PASS |
| **Overall** | **100%** | **PASS** |

---

## 9. Recommended Actions

### 9.1 Immediate

No immediate actions required. All design requirements are fully implemented.

### 9.2 Design Document Updates (Optional)

The following minor implementation details could be documented in the design for completeness:

| Item | Description | Priority |
|------|-------------|----------|
| Hover HL suppression during drag | `onOver` skips when `isDragRef.current` is true; `onMouseMove` calls `removeHL()` | Low |
| `sendMultiToFigma` dual-path logic | Mirrors `sendToFigma` captureId/endpoint fallback pattern | Low |

---

## 10. Next Steps

- [x] Gap analysis complete -- Match Rate 100%
- [ ] Manual QA testing of all 8 verification scenarios (V1-V8)
- [ ] Generate completion report (`/pdca report figma-multiselect`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-27 | Initial gap analysis | Claude (gap-detector) |
