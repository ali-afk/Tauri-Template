import type { Time } from "lightningcss";
import {
	cycleColorScale,
	generateId,
	getLoadPriority,
	parseTime,
} from "$scripts/utils";

describe(parseTime, () => {
	it.each([
		{ time: "0.5s", parsed: 500 },
		{ time: "10ms", parsed: 10 },
		{ time: "-456ms", parsed: -456 },
	])("converts $time (string) to milliseconds", ({ time, parsed }) => {
		expect(parseTime(time as `${number}s` | `${number}ms`)).toBe(parsed);
	});

	it.each([
		{ time: { type: "seconds", value: 99 }, parsed: 99000 },
		{ time: { type: "milliseconds", value: 0.1 }, parsed: 0.1 },
		{ time: { type: "milliseconds", value: -0 }, parsed: -0 },
	])("converts $time (Time) to milliseconds", ({ time, parsed }) => {
		expect(parseTime(time as Time)).toEqual(parsed);
	});
});

describe(generateId, () => {
	it("generates a valid random id", () => {
		expect(generateId("random-prefix")).toSatisfy((val) =>
			/^random-prefix-[a-z0-9]{6}$/.test(val as string),
		);
	});
});

describe(getLoadPriority, () => {
	const threshold = 4;

	it.each([
		{ result: "high", index: 0, comparison: "<" },
		{ result: "low", index: threshold, comparison: "==" },
		{ result: "low", index: 10, comparison: ">" },
	])("returns ($resultPriority) if index ($comparison) threshold", ({
		index,
		result,
	}) => {
		expect(getLoadPriority(index, threshold)).toBe(result);
	});
});

describe(cycleColorScale, () => {
	it("throws if negative index", () => {
		expect(() => cycleColorScale(-10)).toThrow();
	});

	it.each([
		{ result: 100, index: 0 },
		{ result: 300, index: 1 },
		{ result: 100, index: 5 },
		{ result: 300, index: 6 },
	])("returns $result for index $index", ({ index, result }) => {
		expect(cycleColorScale(index)).toBe(result);
	});
});
