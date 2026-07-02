type Result<T> =
	| {
			status: "ok";
			data: T;
	  }
	| {
			status: "error";
			error: string;
	  };

/** Unwraps specta's typed IPC result.
 *  Throws if `{ status: "error" }`, returns `data` if `{ status: "ok" }`.
 *  Use on every Tauri command call to surface Rust errors as JS exceptions. */
export function handleResult<T>(res: Result<T>) {
	if (res.status === "error") {
		throw new Error(`${res.error}`);
	}
	return res.data;
}
