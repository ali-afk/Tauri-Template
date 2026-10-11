# Infrastructure Package Architecture & Dual-Target Adapter Pattern

This document provides a comprehensive guide to the architectural design of `packages/infrastructure`, explaining how this template handles auto-generated Tauri IPC bindings, solves the "bindings consumer" problem, and achieves cross-platform execution (Desktop Native vs. Web/Browser) through clean Ports & Adapters (Hexagonal) Architecture.

---

## 1. Context & The "Bindings Consumer" Problem

When building desktop applications using **Tauri** alongside web frameworks (like **SvelteKit**, **React**, or **Vue**), auto-generating TypeScript IPC wrappers from native backend code (e.g., using `specta` or `tauri-specta`) is the standard pattern for type-safe communication.

However, a naive implementation introduces a critical architectural flaw known as the **Bindings Consumer Problem**:

```
[ UI Component / Domain Logic ] ─────(Direct Import)─────> [ tauri-specta bindings.ts ]
                                                                      │
                                                                      ▼
                                                         [ window.__TAURI_INTERNALS__ ]
                                                         (Crashes on Web Target!)
```

### Why Direct Imports Fail:

1. **Platform Runtime Lock-In:**
   Importing `bindings.ts` directly into UI components or application state stores binds the frontend to Tauri's IPC mechanism. When the app runs in a standard browser (or unit test environment), accessing `window.__TAURI_INTERNALS__` throws a runtime `TypeError`, crashing the application.
2. **Coupling Business Logic to Transport Protocols:**
   Your application logic becomes tied to how commands are transported over Tauri IPC. If transport APIs change, UI components across the entire codebase break.
3. **Monorepo Boundary Violation:**
   Allowing UI packages (`packages/ui`, `packages/app`) to directly import native IPC bindings creates tight coupling, making modular builds and independent package testing difficult.

---

## 2. The Solution: Ports, Adapters, & Runtime Isolation

To make the codebase platform-agnostic and fully dual-target compliant, we isolate **all** Tauri bindings inside `packages/infrastructure`. No package outside of `packages/infrastructure` is ever permitted to import native IPC bindings.

### The Architecture Boundary

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      packages/app & packages/ui                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼ (Consumes Domain Interfaces only)
┌─────────────────────────────────────────────────────────────────────────┐
│                             packages/domain                             │
│                     - SettingsServicePort Interface                     │
│                     - Pure Data Schemas / Types                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       │               Implements SettingsServicePort              │
       ▼                                                           ▼
┌────────────────────────────────────────┐   ┌────────────────────────────┐
│ packages/infrastructure                │   │ packages/infrastructure    │
│  ├── NativeSettingsAdapter             │   │  ├── WebSettingsAdapter    │
│  │    └── (ONLY file importing         │   │  │    └── (Uses LocalStorage, │
│  │         tauri/bindings.ts)          │   │  │         IndexedDB, or REST) │
└────────────────────────────────────────┘   └────────────────────────────┘
       ▲                                                           ▲
       └─────────────────────────────┬─────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    packages/infrastructure/src/factory.ts               │
│        - Runtime check: '__TAURI_INTERNALS__' in window ? Native : Web  │
│        - Instantiates & exports appropriate SettingsServicePort         │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Port Interface (`packages/domain`):** Defines _what_ operations can be performed, completely independent of OS, platform, or framework.
2. **Native Adapter (`packages/infrastructure/src/adapters/native/`):** Implements the Port by wrapping `tauri-specta` commands.
3. **Web / Fallback Adapter (`packages/infrastructure/src/adapters/web/`):** Implements the exact same Port using standard browser APIs (e.g., `localStorage`, `IndexedDB`, or HTTP REST).
4. **Runtime Factory (`packages/infrastructure/src/factory.ts`):** Evaluates the host runtime environment at initialization and serves the correct Adapter instance.

---

## 3. Concrete Reference Example: Device Settings Manager

Below is a complete, production-ready example demonstrating how to manage system-level device preferences (e.g., Dark Mode, Hardware Acceleration, Sync Interval) using this architectural pattern.

### A. The Domain Layer (Port Definition)

**`packages/domain/src/ports/settings.ts`**

```typescript
/**
 * Generic domain types for user device configuration.
 */
export interface DeviceSettings {
	theme: "light" | "dark" | "system";
	hardwareAcceleration: boolean;
	syncIntervalSeconds: number;
}

/**
 * Port Interface defining settings management capabilities.
 * Zero references to Tauri, IPC, HTTP, or Browser APIs.
 */
export interface SettingsServicePort {
	getSettings(): Promise<DeviceSettings>;
	updateSettings(newSettings: Partial<DeviceSettings>): Promise<DeviceSettings>;
	resetToDefaults(): Promise<void>;
}
```

---

### B. The Infrastructure Layer (Native Adapter)

This is the **only** place in the entire frontend ecosystem where native Tauri bindings are imported.

**`packages/infrastructure/src/adapters/native/native-settings-adapter.ts`**

```typescript
import type { SettingsServicePort, DeviceSettings } from "@repo/domain";

// Isolate native IPC bindings inside infrastructure:
import { commands } from "../../tauri/bindings";

export class NativeSettingsAdapter implements SettingsServicePort {
	async getSettings(): Promise<DeviceSettings> {
		// Calls native Rust command over Tauri IPC
		return await commands.getDeviceSettings();
	}

	async updateSettings(newSettings: Partial<DeviceSettings>): Promise<DeviceSettings> {
		return await commands.updateDeviceSettings(newSettings);
	}

	async resetToDefaults(): Promise<void> {
		await commands.resetDeviceSettings();
	}
}
```

---

### C. The Infrastructure Layer (Web / Browser Adapter)

When running inside a web browser, progressive web app (PWA), or automated testing environment, this adapter fulfills the exact same interface using browser-native APIs.

**`packages/infrastructure/src/adapters/web/web-settings-adapter.ts`**

```typescript
import type { SettingsServicePort, DeviceSettings } from "@repo/domain";

const STORAGE_KEY = "app_device_settings";

const DEFAULT_SETTINGS: DeviceSettings = {
	theme: "system",
	hardwareAcceleration: false,
	syncIntervalSeconds: 60,
};

export class WebSettingsAdapter implements SettingsServicePort {
	async getSettings(): Promise<DeviceSettings> {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return DEFAULT_SETTINGS;
		try {
			return JSON.parse(stored) as DeviceSettings;
		} catch {
			return DEFAULT_SETTINGS;
		}
	}

	async updateSettings(newSettings: Partial<DeviceSettings>): Promise<DeviceSettings> {
		const current = await this.getSettings();
		const updated = { ...current, ...newSettings };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		return updated;
	}

	async resetToDefaults(): Promise<void> {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
	}
}
```

---

### D. The Runtime Adapter Factory

The factory detects whether the application is running inside the Tauri native desktop shell or a web browser and exports the corresponding adapter instance.

**`packages/infrastructure/src/factories/settings-factory.ts`**

```typescript
import type { SettingsServicePort } from "@repo/domain";

import { NativeSettingsAdapter } from "../adapters/native/native-settings-adapter";
import { WebSettingsAdapter } from "../adapters/web/web-settings-adapter";

/**
 * Detects whether the active execution context is native Tauri desktop.
 */
function isTauriEnvironment(): boolean {
	return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

// Singleton instances
let instance: SettingsServicePort | null = null;

export function getSettingsService(): SettingsServicePort {
	if (!instance) {
		if (isTauriEnvironment()) {
			instance = new NativeSettingsAdapter();
		} else {
			instance = new WebSettingsAdapter();
		}
	}
	return instance;
}
```

---

### E. Consuming in the Presentation Layer (`packages/app` / `packages/ui`)

In UI views or application controllers, developers simply call `getSettingsService()`. The consumer does not know (and does not care) whether execution happens via Rust IPC or Browser `localStorage`.

**`packages/app/src/stores/settings-store.ts`**

```typescript
import type { DeviceSettings } from "@repo/domain";
import { getSettingsService } from "@repo/infrastructure";

export class SettingsController {
	private service = getSettingsService();

	async initialize(): Promise<DeviceSettings> {
		// Works identically on Desktop App and Browser Web target!
		return await this.service.getSettings();
	}

	async toggleTheme(theme: "light" | "dark" | "system"): Promise<void> {
		await this.service.updateSettings({ theme });
	}
}
```

---

## 4. Key Benefits Summary

| Architectural Feature              | Benefit                                                                                                                                               |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zero UI Breakage on Web Target** | Browser applications gracefully drop down to Web Adapters without throwing runtime IPC crashes.                                                       |
| **Encapsulated Bindings**          | If `tauri-specta` updates or undergoes breaking changes, **only** files inside `packages/infrastructure/src/adapters/native/` need updates.           |
| **Simplified Unit & E2E Testing**  | UI components can be unit-tested in Node/jsdom or Playwright environments by passing mock adapters without spawning full native OS windows.           |
| **Parallel Workstream Capability** | Frontend developers can build out full UI workflows using Web/Mock Adapters before backend engineers finish compiling the native Rust implementation. |
