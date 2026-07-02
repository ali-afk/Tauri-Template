type Result<T> =
	| {
			status: "ok";
			data: T;
	  }
	| {
			status: "error";
			error: string;
	  };

export function handleResult<T>(res: Result<T>) {
	if (res.status === "error") {
		throw new Error(`${res.error}`);
	}
	return res.data;
}
