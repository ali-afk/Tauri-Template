# Shared Rust recipes (test / check / clean) — imported by the Rust package
# modules (app, domain, infrastructure, shell). Recipes run in the importing
# module's directory (just sets cwd to the module file's dir).

# Run tests. `--unit` = library tests; `--e2e` = integration tests; with
# neither, the whole suite runs.
[arg('unit', long, value='1')]
[arg('e2e', long, value='1')]
test unit='' e2e='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{unit}}' && -z '{{e2e}}' ]]; then
		cargo test --no-fail-fast {{FLAGS}}
	else
		if [[ -n '{{unit}}' ]]; then cargo test --lib --no-fail-fast {{FLAGS}}; fi
		if [[ -n '{{e2e}}' ]]; then cargo test --tests --no-fail-fast {{FLAGS}}; fi
	fi

# Check. `--rust` = cargo check + rustfmt; `--md` = markdown (vp fmt); with neither,
# every applicable check runs.
[arg('rust', long, value='1')]
[arg('md', long, value='1')]
check rust='' md='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{rust}}' && -z '{{md}}' ]]; then rust=1; md=1; fi
	if [[ -n '{{rust}}' ]]; then
		RUSTFLAGS="-D warnings" cargo check --all-targets {{FLAGS}}
		cargo fmt --check
	fi
	if [[ -n '{{md}}' ]]; then
		if find . -name '*.md' -not -path '*/node_modules/*' -not -path '*/.out/*' -not -path '*/.svelte-kit/*' | grep -q .; then
			bun vp fmt --check '**/*.md'
		else
			echo "no markdown files in $(basename "$PWD")" >&2
		fi
	fi

# Clean. `--cache` = .cache; `--build` = cargo artifacts; with neither, both.
[arg('cache', long, value='1')]
[arg('build', long, value='1')]
clean cache='' build='' *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	if [[ -z '{{cache}}' && -z '{{build}}' ]]; then cache=1; build=1; fi
	if [[ -n '{{cache}}' ]]; then rm -rf .cache; fi
	if [[ -n '{{build}}' ]]; then cargo clean; fi
