type siteProperty = string | Record<string, string>;

/**
 * Centralized site-wide properties
 *
 * TEMPLATE NOTE: Update these values for your project!
 * - siteUrl: Your production domain
 * - siteName: Your project/brand name
 * - siteDescription: Brief description for SEO
 * - author: Your name or organization
 * - contact: Update with your contact info
 */
export const SiteProperties = {
	/** Base URL for the production site (update for your domain) */
	siteUrl: "https://example.com",

	/** Name of your site/project */
	siteName: "SvelteKit Template",

	/** Brief description for SEO and social sharing */
	siteDescription: "A modern, accessible web application built with SvelteKit",

	/** Site author/creator */
	author: "Your Name",

	/** Contact information */
	contact: {
		email: "contact@example.com",
		// Add your social media links here (optional)
		// github: "https://github.com/yourusername",
		// twitter: "https://twitter.com/yourusername",
	},
} as const satisfies Record<string, siteProperty>;
