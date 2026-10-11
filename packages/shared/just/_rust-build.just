# Shared Rust build recipe — imported by the library crate modules
# (app, domain, infrastructure). Pass cargo flags directly, e.g. `--release`.

build *FLAGS:
	cargo build {{FLAGS}}
