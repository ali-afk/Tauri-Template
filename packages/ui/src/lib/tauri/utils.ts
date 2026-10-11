type Result<T, E = string> =
	| {
			status: "ok";
			data: T;
	  }
	| {
			status: "error";
			error: E;
	  };

export function handleResult<T, E>(res: Result<T, E>) {
	if (res.status === "error") {
		throw new Error(`${res.error}`);
	}
	return res.data;
}
