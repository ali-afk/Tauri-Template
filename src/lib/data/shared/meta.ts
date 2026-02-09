import { SiteProperties } from "$data/shared/site-properties";

/**
 * JSON-LD structured data for Organization/Website
 * Used for search engine optimization and social media
 *
 * TEMPLATE NOTE: Update this with your organization details!
 * - name: Your site/organization name
 * - description: Brief description of your site
 * - logo: Path to your logo (typically /icon-512.png for PWA icon)
 * - Add social media links to sameAs array
 */
export const OrganizationData = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Organization",
	name: SiteProperties.siteName,
	description: SiteProperties.siteDescription,
	url: SiteProperties.siteUrl,
	logo: `${SiteProperties.siteUrl}/icon-512.png`,
	email: SiteProperties.contact.email,
	// Add your social media profiles here
	// sameAs: [
	// 	"https://github.com/yourusername",
	// 	"https://twitter.com/yourusername",
	// ],
});

/**
 * JSON-LD structured data for WebSite
 * Helps search engines understand your site
 */
export const WebSiteData = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SiteProperties.siteName,
	url: SiteProperties.siteUrl,
	description: SiteProperties.siteDescription,
	author: {
		"@type": "Person",
		name: SiteProperties.author,
	},
});
