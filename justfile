import './packages/shared/just/workspaces.just'
import './packages/shared/just/hooks/lint-title.just'

# --- package modules -------------------------------------------------------
# Each package's recipes live in packages/<pkg>/justfile and run in that
# directory. Invoke as `just <pkg> <recipe>`, e.g. `just app build`.

mod app 'packages/app/justfile'
mod domain 'packages/domain/justfile'
mod infrastructure 'packages/infrastructure/justfile'
mod shell 'packages/shell/justfile'
mod ui 'packages/ui/justfile'
mod web 'packages/web/justfile'
mod docs 'packages/docs/justfile'
mod shared 'packages/shared/justfile'

# List every recipe, including the per-package modules.
default:
	@just --list

# --- all-packages orchestration --------------------------------------------

# Build every package (skips packages without a `build` recipe).
build-all *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	summary=$(just --summary)
	for pkg in {{WORKSPACES}}; do
		if grep -qw "$pkg::build" <<<"$summary"; then just "$pkg" build {{FLAGS}}; fi
	done

# Test every package (skips packages without a `test` recipe).
test-all *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	summary=$(just --summary)
	for pkg in {{WORKSPACES}}; do
		if grep -qw "$pkg::test" <<<"$summary"; then just "$pkg" test {{FLAGS}}; fi
	done

# Check every package (skips packages without a `check` recipe).
check-all *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	summary=$(just --summary)
	for pkg in {{WORKSPACES}}; do
		if grep -qw "$pkg::check" <<<"$summary"; then just "$pkg" check {{FLAGS}}; fi
	done

# Clean every package (skips packages without a `clean` recipe).
clean-all *FLAGS:
	#!/usr/bin/env bash
	set -euo pipefail
	summary=$(just --summary)
	for pkg in {{WORKSPACES}}; do
		if grep -qw "$pkg::clean" <<<"$summary"; then just "$pkg" clean {{FLAGS}}; fi
	done
