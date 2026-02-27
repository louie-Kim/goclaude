import { FigmaCaptureButton } from "./FigmaCaptureButton";

// Inline script that runs synchronously BEFORE capture.js (async) loads.
// It strips the #figmacapture=... hash and saves params under CUSTOM key names
// so capture.js never sees the hash AND never finds the keys it looks for.
// capture.js reads sessionStorage['figma_id'] and ['figma_ep'] — we use different
// names (__cap_id / __cap_ep) so capture.js won't auto-submit on page load.
const interceptScript = `
(function() {
  var h = window.location.hash;
  if (h && h.includes('figmacapture=')) {
    try {
      var p = new URLSearchParams(h.slice(1));
      var id = p.get('figmacapture');
      var ep = p.get('figmaendpoint');
      if (id && ep) {
        sessionStorage.setItem('__cap_id', id);
        sessionStorage.setItem('__cap_ep', decodeURIComponent(ep));
      }
    } catch(e) {}
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
})();
`;

export default function SaasDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 1. Strip hash BEFORE capture.js sees it → prevents Figma's own toolbar */}
      <script dangerouslySetInnerHTML={{ __html: interceptScript }} />
      {/* 2. Load capture.js for window.figma API only (toolbar won't appear) */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      {children}
      <FigmaCaptureButton />
    </>
  );
}
