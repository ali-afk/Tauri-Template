type appProperty = string | Record<string, string>;

/**
 * Centralized app-wide properties
 *
 * TEMPLATE NOTE: Update these values for your project!
 * - appName: Your app name (used in window titles)
 * - appDescription: Brief description of the application
 * - siteUrl: Your project website or repository URL
 * - author: Your name or organization
 * - contact: Update with your contact info
 */
export const AppProperties = {
	/** Name of your app (shown in window titles) */
	appName: "SvelteKit Template",

	/** Brief description of the application */
	appDescription:
		"A modern, accessible desktop application built with Tauri and SvelteKit",

	/** Project website or repository URL */
	appUrl: "https://example.com",

	/** App author/creator */
	author: "Ali Hussain",

	/** Contact information */
	contact: {
		email: "ali.hussain.ali.oun@gmail.com",
		github: "https://github.com/ali-afk",
		// Add your links here (optional)
	},
} as const satisfies Record<string, appProperty>;
