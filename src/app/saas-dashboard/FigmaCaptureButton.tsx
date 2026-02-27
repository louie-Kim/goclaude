"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    figma?: {
      captureForDesign: (opts?: {
        captureId?: string;
        endpoint?: string;
        selector?: string;
      }) => Promise<void>;
    };
  }
}

const FIGMA_URL =
  "https://www.figma.com/design/A2ZU1TZOkfdbE9MYDiXbyI/Untitled?node-id=0-1";

// ── Safe CSS selector ──────────────────────────────────────────────────────────
function getCssSelector(el: Element): string {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    let seg = cur.tagName.toLowerCase();
    const parent = cur.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === cur!.tagName
      );
      if (siblings.length > 1)
        seg += `:nth-of-type(${siblings.indexOf(cur as Element) + 1})`;
    }
    parts.unshift(seg);
    cur = cur.parentElement;
    if (parts.length >= 4) break;
  }
  return parts.join(" > ");
}

const SAFE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
function elLabel(el: Element) {
  const cls = Array.from(el.classList)
    .filter((c) => SAFE.test(c))
    .slice(0, 2);
  return el.tagName.toLowerCase() + (cls.length ? "." + cls.join(".") : "");
}

// ── Highlight ──────────────────────────────────────────────────────────────────
const HL_ID = "__cap_hl__";
function showHL(el: Element) {
  removeHL();
  const r = el.getBoundingClientRect();
  const d = document.createElement("div");
  d.id = HL_ID;
  Object.assign(d.style, {
    position: "fixed", pointerEvents: "none", zIndex: "99990",
    boxSizing: "border-box", borderRadius: "6px",
    top: r.top + "px", left: r.left + "px",
    width: r.width + "px", height: r.height + "px",
    border: "2px dashed #818cf8",
    background: "rgba(129,140,248,0.07)",
  });
  document.body.appendChild(d);
}
function removeHL() { document.getElementById(HL_ID)?.remove(); }

// ── Multi-select highlight ─────────────────────────────────────────────────────
const HL_MULTI_CLASS = "__cap_hl_multi__";

function addSelHL(el: Element, idx: number) {
  const r = el.getBoundingClientRect();
  const d = document.createElement("div");
  d.className = HL_MULTI_CLASS;
  Object.assign(d.style, {
    position: "fixed", pointerEvents: "none", zIndex: "99990",
    boxSizing: "border-box", borderRadius: "6px",
    top: r.top + "px", left: r.left + "px",
    width: r.width + "px", height: r.height + "px",
    border: "2px solid #818cf8",
    background: "rgba(129,140,248,0.10)",
  });
  const badge = document.createElement("span");
  badge.textContent = String(idx + 1);
  Object.assign(badge.style, {
    position: "absolute", top: "-8px", left: "-8px",
    background: "#818cf8", color: "#fff",
    borderRadius: "50%", width: "16px", height: "16px",
    fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center",
  });
  d.appendChild(badge);
  document.body.appendChild(d);
}

function removeAllSelHL() {
  document.querySelectorAll("." + HL_MULTI_CLASS).forEach(d => d.remove());
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getCommonAncestor(elements: Element[]): Element {
  if (elements.length === 1) return elements[0];
  let node: Element | null = elements[0].parentElement;
  while (node && node !== document.body) {
    if (elements.every(el => node!.contains(el))) return node;
    node = node.parentElement;
  }
  return document.body;
}

function getElementsInRect(x1: number, y1: number, x2: number, y2: number): Sel[] {
  const left = Math.min(x1, x2), top = Math.min(y1, y2);
  const right = Math.max(x1, x2), bottom = Math.max(y1, y2);
  if (right - left < 4 || bottom - top < 4) return [];

  const candidates = new Set<Element>();
  for (let x = left + 8; x < right; x += 24) {
    for (let y = top + 8; y < bottom; y += 24) {
      document.elementsFromPoint(x, y).forEach(el => {
        if (el === document.body || el === document.documentElement) return;
        if ((el as HTMLElement).id?.includes("cap_hl") || (el as HTMLElement).id?.includes("figma")) return;
        candidates.add(el);
      });
    }
  }

  const filtered: Element[] = [];
  candidates.forEach(el => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx >= left && cx <= right && cy >= top && cy <= bottom) {
      filtered.push(el);
    }
  });

  const outermost = filtered.filter(el =>
    !filtered.some(other => other !== el && other.contains(el))
  );

  return outermost.map(el => ({ el, selector: getCssSelector(el), label: elLabel(el) }));
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Mode = "idle" | "picking" | "selected";
type Toast = { msg: string; ok: boolean } | null;
interface Sel { el: Element; selector: string; label: string }

// ── Icons ──────────────────────────────────────────────────────────────────────
const IcPick = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
  </svg>
);
const IcClip = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IcFigma = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/>
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/>
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/>
  </svg>
);
const IcX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const Sep = () => <div className="w-px h-4 bg-white/10 mx-0.5 flex-shrink-0" />;

// ── Component ──────────────────────────────────────────────────────────────────
export function FigmaCaptureButton() {
  const [mode, setMode]         = useState<Mode>("idle");
  const [sel, setSel]           = useState<Sel | null>(null);
  const [sels, setSels]         = useState<Sel[]>([]);
  const [toast, setToast]       = useState<Toast>(null);
  const [sending, setSending]   = useState(false);
  const [dragRect, setDragRect] = useState<{x:number;y:number;w:number;h:number}|null>(null);

  const modeRef          = useRef<Mode>("idle");
  modeRef.current        = mode;
  const selsRef          = useRef<Sel[]>([]);
  selsRef.current        = sels;
  const dragStartRef     = useRef<{x:number;y:number}|null>(null);
  const isDragRef        = useRef(false);
  const dragJustEndedRef = useRef(false);
  const toolbarRef       = useRef<HTMLDivElement>(null);

  // Hide Figma's own toolbar
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll<HTMLElement>(
        "[data-figma-capture-toolbar],[id*='figma-capture'],[id*='figma_capture'],[id='__figma_capture_toolbar_host__'],[class*='figma-toolbar']"
      ).forEach((el) => {
        el.style.display = "none";
        el.style.pointerEvents = "none";
      });
    };
    hide();
    const obs = new MutationObserver(hide);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Resolve effective selector (single or common ancestor for multi) ────────
  const TMP_ID = "__cap_multi_target__";
  const captureCleanupRef = useRef<(() => void) | null>(null);

  const getSelector = (): string | null => {
    // cleanup any previous temp ID
    captureCleanupRef.current?.();
    captureCleanupRef.current = null;

    if (sels.length > 1) {
      const container = getCommonAncestor(sels.map(s => s.el)) as HTMLElement;
      const prevId = container.id;
      container.id = TMP_ID;
      captureCleanupRef.current = () => {
        if (prevId) container.id = prevId;
        else container.removeAttribute("id");
      };
      return "#" + TMP_ID;
    }
    return sel?.selector ?? null;
  };

  // ── Picker event handlers ────────────────────────────────────────────────────
  const onOver = useCallback((e: MouseEvent) => {
    if (modeRef.current !== "picking") return;
    if (isDragRef.current) return;
    const el = e.target as Element;
    if (el?.id !== HL_ID) showHL(el);
  }, []);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removePick = useCallback(() => {
    document.body.style.cursor = "";
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("mousedown", onMouseDown, true); // eslint-disable-line react-hooks/exhaustive-deps
    document.removeEventListener("mousemove", onMouseMove, true); // eslint-disable-line react-hooks/exhaustive-deps
    document.removeEventListener("mouseup", onMouseUp, true);     // eslint-disable-line react-hooks/exhaustive-deps
    document.removeEventListener("click", onClickEl, true);       // eslint-disable-line react-hooks/exhaustive-deps
    document.removeEventListener("keydown", onKey);
  }, [onOver, onKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickEl = useCallback((e: MouseEvent) => {
    if (modeRef.current !== "picking") return;
    if (dragJustEndedRef.current) { dragJustEndedRef.current = false; return; }
    const el = e.target as Element;
    if (!el || el.id === HL_ID) return;
    if (toolbarRef.current?.contains(el)) return;
    e.preventDefault(); e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      const newSel = { el, selector: getCssSelector(el), label: elLabel(el) };
      const next = [...selsRef.current, newSel];
      selsRef.current = next;
      setSels(next);
      addSelHL(el, next.length - 1);
      removeHL();
    } else {
      removeAllSelHL();
      selsRef.current = [];
      setSels([]);
      removePick();
      showHL(el);
      setSel({ el, selector: getCssSelector(el), label: elLabel(el) });
      setMode("selected");
    }
  }, [removePick]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (modeRef.current !== "picking") return;
    if (e.button !== 0) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDragRef.current = false;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (modeRef.current !== "picking" || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (!isDragRef.current && Math.hypot(dx, dy) < 6) return;
    isDragRef.current = true;
    const x = Math.min(dragStartRef.current.x, e.clientX);
    const y = Math.min(dragStartRef.current.y, e.clientY);
    setDragRect({ x, y, w: Math.abs(dx), h: Math.abs(dy) });
    removeHL();
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (modeRef.current !== "picking" || !dragStartRef.current) return;
    const start = dragStartRef.current;
    const wasDrag = isDragRef.current;
    dragStartRef.current = null;
    isDragRef.current = false;
    setDragRect(null);
    if (!wasDrag) return;

    dragJustEndedRef.current = true;
    setTimeout(() => { dragJustEndedRef.current = false; }, 0);

    const found = getElementsInRect(start.x, start.y, e.clientX, e.clientY);
    if (found.length === 0) return;

    removeAllSelHL();
    selsRef.current = found;
    setSels(found);
    found.forEach((s, i) => addSelHL(s.el, i));

    if (found.length === 1) {
      removePick();
      showHL(found[0].el);
      setSel(found[0]);
      setSels([]); selsRef.current = [];
      setMode("selected");
    } else {
      removePick();
      removeHL();
      setSel(found[0]);
      setMode("selected");
    }
  }, [removePick]);

  const startPick = () => {
    setSel(null); setSels([]); selsRef.current = [];
    removeHL(); removeAllSelHL();
    setMode("picking");
    document.body.style.cursor = "crosshair";
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("click", onClickEl, true);
    document.addEventListener("keydown", onKey);
  };

  const cancel = useCallback(() => {
    removePick(); removeHL(); removeAllSelHL();
    setSel(null); setSels([]); selsRef.current = [];
    setDragRect(null);
    setMode("idle");
  }, [removePick]);

  const handleCtrlDone = () => {
    if (selsRef.current.length === 0) return;
    removePick();
    removeHL();
    setSel(selsRef.current[0]);
    setMode("selected");
  };

  useEffect(() => () => { cancel(); removeHL(); }, [cancel]);

  // Escape in selected mode
  useEffect(() => {
    if (mode !== "selected") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") cancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mode, cancel]);

  // ── Actions (unified: single & multi) ─────────────────────────────────────
  const copyToClipboard = async () => {
    const selector = getSelector();
    if (!selector) return;
    if (!window.figma?.captureForDesign) {
      showToast("capture.js가 로드되지 않았습니다", false);
      return;
    }
    try {
      await Promise.race([
        window.figma.captureForDesign({ selector }),
        new Promise<void>((resolve) => setTimeout(resolve, 2000)),
      ]);
      const msg = sels.length > 1
        ? `✓ ${sels.length}개 클립보드에 복사됨 — Figma에서 붙여넣기 하세요`
        : "✓ 클립보드에 복사됨 — Figma에서 붙여넣기 하세요";
      showToast(msg);
      cancel();
    } catch {
      showToast("복사 실패", false);
    } finally {
      captureCleanupRef.current?.();
      captureCleanupRef.current = null;
    }
  };

  const sendToFigma = async () => {
    const selector = getSelector();
    if (!selector) return;
    setSending(true);
    const captureId = sessionStorage.getItem("__cap_id") ?? undefined;
    const endpoint  = sessionStorage.getItem("__cap_ep") ?? undefined;

    if (!window.figma?.captureForDesign) {
      showToast("capture.js가 로드되지 않았습니다", false);
      setSending(false); return;
    }

    if (!captureId || !endpoint) {
      try {
        await Promise.race([
          window.figma.captureForDesign({ selector }),
          new Promise<void>((resolve) => setTimeout(resolve, 2000)),
        ]);
        showToast("클립보드에 복사됨 — Figma에서 Ctrl+V로 붙여넣기 하세요");
        cancel();
        window.open(FIGMA_URL, "_blank");
      } catch {
        showToast("복사 실패 — Figma 플러그인 연결을 확인하세요", false);
      } finally {
        captureCleanupRef.current?.();
        captureCleanupRef.current = null;
        setSending(false);
      }
      return;
    }

    try {
      const result = await Promise.race([
        window.figma.captureForDesign({ captureId, endpoint, selector })
          .then(() => "ok" as const),
        new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 5000)),
      ]);

      if (result === "timeout") {
        showToast("전송 요청됨 — Figma에서 확인하세요");
      } else {
        showToast("✓ Figma로 전송됨 — 프로젝트를 엽니다");
      }
      cancel();
      window.open(FIGMA_URL, "_blank");
    } catch {
      showToast("전송 실패 — Figma 플러그인 연결을 확인하세요", false);
    } finally {
      captureCleanupRef.current?.();
      captureCleanupRef.current = null;
      setSending(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const btn = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/8 transition-all";
  const btnPurple = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-purple-300 hover:text-purple-200 hover:bg-purple-500/15 transition-all";

  return (
    <>
      {/* ── Toolbar ── */}
      <div
        ref={toolbarRef}
        style={{ zIndex: 99999 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-[#1c1c1f]/95 border border-white/10 backdrop-blur-md rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/60 select-none whitespace-nowrap"
      >
        {mode === "idle" && (
          <button onClick={startPick} className={btn}>
            <IcPick /><span>요소 선택</span>
          </button>
        )}

        {mode === "picking" && (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mx-1 flex-shrink-0" />
            <span className="text-sm text-white font-medium px-2">
              {sels.length > 0
                ? `${sels.length}개 선택 — Ctrl+클릭 추가`
                : "캡처할 요소를 클릭하세요"}
            </span>
            {sels.length > 0 && (
              <>
                <Sep />
                <button onClick={handleCtrlDone} className={btnPurple}>완료</button>
              </>
            )}
            <Sep />
            <button onClick={cancel} className={btn}><IcX /></button>
          </>
        )}

        {mode === "selected" && sel && (
          <>
            <span className="text-xs font-mono text-indigo-300 px-2 max-w-36 truncate">
              {sels.length > 1 ? `${sels.length}개 선택됨` : sel.label}
            </span>
            <Sep />
            <button onClick={copyToClipboard} className={btn} title="클립보드에 복사">
              <IcClip /><span>복사</span>
            </button>
            <Sep />
            <button onClick={sendToFigma} disabled={sending} className={btnPurple} title="Figma로 전송">
              <IcFigma />
              <span>{sending ? "전송 중…" : "Figma로 보내기"}</span>
            </button>
            <Sep />
            <button onClick={startPick} className={btn} title="다시 선택"><IcPick /></button>
            <button onClick={cancel} className={btn}><IcX /></button>
          </>
        )}
      </div>

      {/* ── Drag overlay ── */}
      {dragRect && (
        <div
          style={{
            position: "fixed",
            zIndex: 99991,
            pointerEvents: "none",
            left: dragRect.x + "px",
            top: dragRect.y + "px",
            width: dragRect.w + "px",
            height: dragRect.h + "px",
            border: "1.5px dashed #818cf8",
            background: "rgba(129,140,248,0.06)",
            borderRadius: "4px",
          }}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{ zIndex: 99999 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-sm font-medium shadow-xl pointer-events-none
            ${toast.ok
              ? "bg-[#1c1c1f]/95 border border-white/10 text-white backdrop-blur-md"
              : "bg-red-950/95 border border-red-500/30 text-red-300"
            }`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
