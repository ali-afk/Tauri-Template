/** Result envelope every port method resolves with.
 *  Mirrors the shape produced by the specta bindings' typedError helper
 *  (and packages/ui handleResult), so the native adapter can pass command
 *  results through unchanged and callers keep the typed AppError. */
export type Result<T, E> =
	| {
			status: "ok";
			data: T;
	  }
	| {
			status: "error";
			error: E;
	  };
