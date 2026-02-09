import { SiteProperties } from "./site-properties";

/**
 * robots.txt content
 * Tells search engines which pages to crawl
 */
export const RobotsData = `# allow crawling everything by default
User-agent: *
Disallow:

# Sitemap location
Sitemap: ${SiteProperties.siteUrl}/sitemap.xml`;

/**
 * security.txt content (RFC 9116)
 * Provides security contact information
 */
export const SecurityData = `Contact: mailto:${SiteProperties.contact.email}
Expires: 2027-12-31T23:59:59Z
Preferred-Languages: en
Canonical: ${SiteProperties.siteUrl}/.well-known/security.txt`;
