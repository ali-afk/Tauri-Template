import { SiteProperties } from "$data/shared";
import type { RequestHandler } from "./$types";

export const prerender = true;

const site = SiteProperties.siteUrl;

// Pages that should be included in the sitemap
// Add your pages here as you build them
// Excludes pages with NoIndex meta or pages not meant for search engines
const pages = [
	"/", // Home page
	// Add more pages as you create them:
	// "/about",
	// "/blog",
	// "/contact",
];

export const GET: RequestHandler = () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `	<url>
		<loc>${site}${page}</loc>
		<changefreq>weekly</changefreq>
		<priority>${page === "/" ? "1.0" : "0.8"}</priority>
	</url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "max-age=0, s-maxage=3600",
		},
	});
};
