import { expect, test } from "vitest";
import { allPairs } from "./functional";

test("allPairs", () => {
	const pairs = allPairs([1, 2, 3, 4]);

	expect(pairs).toStrictEqual([
		[1, 2],
		[2, 3],
		[3, 4],
	]);
});
