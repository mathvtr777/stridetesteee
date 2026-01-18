# AI Editor Rules and Project Guidelines (Dyad)

This document outlines the core technologies used in the Stride application and provides clear rules for library usage to ensure consistency, maintainability, and performance.

## 1. Tech Stack Overview

The Stride application is built using a modern, mobile-first web stack:

*   **Framework:** React (with Vite and TypeScript).
*   **Styling:** Tailwind CSS, utilizing custom utility classes (like `.glass`, `.btn-gradient`) and CSS variables defined in `src/index.css`.
*   **UI Library:** shadcn/ui components (built on Radix UI primitives).
*   **State Management:** Zustand, with persistence middleware for local storage.
*   **Routing:** React Router DOM (v6).
*   **Local Data Persistence:** `idb` (IndexedDB wrapper) for storing user data (runs, goals, profile) via `src/lib/db.ts`.
*   **Mapping:** `maplibre-gl` for rendering interactive maps and tracking routes.
*   **Icons:** Material Symbols (via CDN link in `index.html` and the custom `Icon` component).
*   **Utilities:** `clsx` and `tailwind-merge` (via `src/lib/utils.ts`).

## 2. Library Usage Rules

To maintain a clean and consistent codebase, adhere to the following rules when implementing new features or modifying existing code:

| Feature | Recommended Library/Tool | Notes |
| :--- | :--- | :--- |
| **UI Components** | shadcn/ui | Use existing components. If customization is needed, create a new component file. |
| **Styling** | Tailwind CSS | Always use utility classes. Utilize custom classes like `.glass` and `.btn-gradient` where appropriate. |
| **Icons** | Material Symbols | Use the custom `Icon` component (`src/components/ui/Icon.tsx`) which relies on Material Symbols font names. |
| **Global State** | Zustand (`useAppStore`) | All application state (runs, profile, goals, active run) must be managed here. |
| **Routing** | React Router DOM | Keep all primary routes defined in `src/App.tsx`. |
| **Local Storage** | `idb` (via `src/lib/db.ts`) | Use the provided database functions (`saveRun`, `getProfile`, etc.) for persistent data. |
| **Maps/Geo** | `maplibre-gl` & `useGeolocation` | Use `maplibre-gl` for map rendering and `src/hooks/useGeolocation.ts` for location tracking. |
| **Toasts/Notifications** | Sonner (`@/components/ui/sonner`) | Use Sonner for non-intrusive notifications. |
| **Layout** | `AppLayout` | Use `src/components/layout/AppLayout.tsx` for all main pages to ensure consistent navigation and padding. |