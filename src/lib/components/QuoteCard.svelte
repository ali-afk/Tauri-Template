<script lang="ts">
/** Quote/testimonial card with avatar, title, and blockquote.
 *  direction="left" (default) renders avatar-left/text-right.
 *  direction="right" flips via .reverse class (row-reverse flex).
 *  Collapses to column on mobile (≤768px). Color scale cycles
 *  via cycleColorScale() — see architecture-decisions.md. */
import { QuoteCardHeader } from "$components/helpers";
import { DesignTokens } from "$data/design-tokens";
import type { ColorDegrees } from "$types/colors";
import type { LoadPriority, QuoteData } from "$types/component-props";

interface Props extends QuoteData {
	loadPriority: LoadPriority;
	color: ColorDegrees;
	direction: "left" | "right";
}

let { title, comment, avatar, loadPriority, color, direction }: Props =
	$props();
const colorSet = DesignTokens.color.primary;
</script>

<article
	style="--_background: {colorSet[color]}"
	class:reverse={direction === 'right'}
	class="wrapper card row lift--strong"
>
	<QuoteCardHeader {title} {avatar} {loadPriority}></QuoteCardHeader>

	<blockquote class="content">
		<p>{comment}</p>
	</blockquote>
</article>

<style>
article {
	position: relative;

	blockquote {
		flex: 1;
		padding: var(--space-5) var(--space-7) var(--space-5) 0;
		display: flex;
		align-items: center;

		p {
			font-size: var(--fs-4);
			line-height: var(--lh-2);
			font-style: italic;
		}
	}

	&::before {
		content: "“";
		position: absolute;
		inset: -5rem 0 0 1rem;
		font-size: 14rem;
		opacity: 0.1;
	}

	&.reverse {
		flex-direction: row-reverse;

		blockquote {
			padding: var(--space-5) 0 var(--space-5) var(--space-7);
		}
	}
}

@media (max-width: 768px) {
	/* DesignTokens.breakpoint[2] */
	article,
	article.reverse {
		flex-direction: column;

		blockquote {
			padding: 0 var(--space-5) var(--space-5);
		}
	}
}
</style>
