// Disable SSR + prerender for Tauri desktop builds (adapter-static SPA mode).
// +layout.ts is always loaded — SSR would try to render in Node, which breaks
// Tauri IPC calls. prerender generates static HTML for the shell.
export const ssr = false;
export const prerender = true;
