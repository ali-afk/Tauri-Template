import { DesignTokens, SiteProperties } from "$data/shared";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () => {
	const manifest = {
		name: SiteProperties.siteName,
		short_name: SiteProperties.siteName,
		description: SiteProperties.siteDescription,
		start_url: "/",
		display: "standalone",
		background_color: `${DesignTokens.color.base[100]}`,
		theme_color: `${DesignTokens.color.primary[500]}`,
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
		],
	};

	return new Response(JSON.stringify(manifest, null, "\t"), {
		headers: {
			"Content-Type": "application/manifest+json",
			"Cache-Control": "max-age=0, s-maxage=86400",
		},
	});
};
