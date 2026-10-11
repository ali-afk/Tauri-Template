# Validate a commit message title against the allowed type list.
# Invoked by lefthook's `commit-msg` hook: `just lint-title <msg-file>`.
lint-title msgfile:
	#!/usr/bin/env bash
	set -euo pipefail
	line=$(head -n1 "{{msgfile}}" | sed -E 's/^(fixup! |squash! )//')
	types='fix|config|feat|feat-rm|update|docs|chore|style|content|misc|refactor|merge|experimental|test'
	if [[ "$line" =~ ^($types)([+]($types))*:[[:space:]].+ ]]; then
		exit 0
	fi
	printf '%s\n' '--------------------------------------------------------' >&2
	printf '%s\n' '❌ INVALID COMMIT FORMAT' >&2
	printf '%s\n' 'Expected: <type>: <summary>  OR  <type>+<type>: <summary>' >&2
	printf '%s\n' "Allowed: ${types//|/, }" >&2
	printf '%s\n' '--------------------------------------------------------' >&2
	exit 1
