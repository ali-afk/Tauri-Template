# Shared frontend recipes (dev / build / test / check / clean) — imported by the
# TS/Svelte package modules (ui, web, docs). Recipes run in the importing
# module's directory (just sets cwd to the module file's dir).

dev *FLAGS:
	bun vp dev {{FLAGS}}

build *FLAGS:
	bun vp run build {{FLAGS}}

# Run tests. `--unit` = vitest; `--e2e` = WebdriverIO (runs only where a
# wdio.conf.ts exists); with neither, every currently-configured suite runs.
[arg('unit', long, value='1')]
[arg('e2e', long, value='1')]
test unit='' e2e='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{unit}}' && -z '{{e2e}}' ]]; then
		bun vp test {{FLAGS}}
	else
		if [[ -n '{{unit}}' ]]; then bun vp test {{FLAGS}}; fi
		if [[ -n '{{e2e}}' ]]; then
			if [[ -f wdio.conf.ts ]]; then
				bunx wdio run ./wdio.conf.ts {{FLAGS}}
			else
				echo "no e2e runner configured for $(basename "$PWD")" >&2
			fi
		fi
	fi

# Check. `--ts` = tsc; `--svelte` = svelte-check; `--md` = markdown (vp fmt); with
# none, `vp check` runs format + lint + type together.
[arg('ts', long, value='1')]
[arg('svelte', long, value='1')]
[arg('md', long, value='1')]
check ts='' svelte='' md='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{ts}}' && -z '{{svelte}}' && -z '{{md}}' ]]; then
		bun vp check --fix {{FLAGS}}
	else
		if [[ -n '{{ts}}' ]]; then bun vp exec tsc --noEmit {{FLAGS}}; fi
		if [[ -n '{{svelte}}' ]]; then bun vp exec svelte-check-rs {{FLAGS}}; fi
		if [[ -n '{{md}}' ]]; then
			if find . -name '*.md' -not -path '*/node_modules/*' -not -path '*/.out/*' -not -path '*/.svelte-kit/*' | grep -q .; then
				bun vp fmt --check '**/*.md'
			else
				echo "no markdown files in $(basename "$PWD")" >&2
			fi
		fi
	fi

# Clean. `--cache` = .cache + .svelte-kit; `--build` = .out; `--reports` =
# .out/reports; with none, all.
[arg('cache', long, value='1')]
[arg('build', long, value='1')]
[arg('reports', long, value='1')]
clean cache='' build='' reports='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{cache}}' && -z '{{build}}' && -z '{{reports}}' ]]; then cache=1; build=1; reports=1; fi
	if [[ -n '{{cache}}' ]]; then rm -rf .cache .svelte-kit; fi
	if [[ -n '{{build}}' ]]; then rm -rf .out; fi
	if [[ -n '{{reports}}' ]]; then rm -rf .out/reports; fi
