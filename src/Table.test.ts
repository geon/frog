import { expect, test } from "vitest";
import {
	addValue,
	getValues,
	getValue,
	makeEmptyTable,
	setValue,
} from "./Table";

test("makeEmptyTable", () => {
	const table = makeEmptyTable<string>();
	expect(getValues(table)).toStrictEqual([]);
});

test("addValueToTable", () => {
	const table = makeEmptyTable<{ id: number; value: string }>();
	addValue(table, { value: "geon" });
	expect(getValues(table)[0].value).toBe("geon");
});

test("addValuesToTable", () => {
	const table = makeEmptyTable<{ id: number; value: string }>();
	addValue(table, { value: "geon" });
	addValue(table, { value: "neon" });
	expect(getValues(table).map((x) => x.value)).toStrictEqual(["geon", "neon"]);
});

test("getValueById", () => {
	const table = makeEmptyTable<{ id: number; value: string }>();
	const geonId = addValue(table, { value: "geon" }).id;
	const neonId = addValue(table, { value: "neon" }).id;
	expect(getValue(table, geonId).value).toBe("geon");
	expect(getValue(table, neonId).value).toBe("neon");
});

test("setValueById", () => {
	const table = makeEmptyTable<string>();
	setValue(table, 1, "geon");
	setValue(table, 2, "neon");
	expect(getValue(table, 1)).toBe("geon");
	expect(getValue(table, 2)).toBe("neon");
});
