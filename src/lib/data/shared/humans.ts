import { SiteProperties } from "./site-properties";

/**
 * Team credits and contributor information for humans.txt
 *
 * TEMPLATE NOTE: Update this with your team/project credits!
 * Add your name, collaborators, and project history here.
 */

export interface TeamMember {
	name: string;
	email?: string;
	linkedin?: string;
	github?: string;
}

export interface YearCredits {
	year: string;
	members: TeamMember[];
}

/**
 * Team credits by year
 * Add new years at the top
 */
export const teamCredits: YearCredits[] = [
	{
		year: "2026",
		members: [
			{
				name: "Your Name",
				email: SiteProperties.contact.email,
				// Add your social profiles:
				// linkedin: "https://linkedin.com/in/yourusername",
				// github: "https://github.com/yourusername",
			},
		],
	},
];

/**
 * Generate humans.txt content
 */
export const HumansData = `/* TEAM */
Creator: ${SiteProperties.author}
Email: ${SiteProperties.contact.email}

/* CREDITS */
${teamCredits
	.map(
		(yearGroup) => `--- ${yearGroup.year} ---
${yearGroup.members
	.map(
		(member) =>
			`- ${member.name}${member.email ? `\nEmail: ${member.email}` : ""}${member.linkedin ? `\nLinkedIn: ${member.linkedin}` : ""}${member.github ? `\nGitHub: ${member.github}` : ""}`,
	)
	.join("\n\n")}
--- ${yearGroup.year} ---`,
	)
	.join("\n\n")}

/* SITE */
Last update: ${new Date().toISOString().split("T")[0]}
Stack: SvelteKit, Svelte 5, TypeScript, LightningCSS, Biome, Vite
Deployment: Netlify
Fonts: Average, Girassol

/* ABOUT */
This is a personal SvelteKit starter template featuring:
- Design token system with CSS.registerProperty()
- Auto-contrast OKLCH color system
- Reusable component library
- PWA support
- SEO optimized`;
