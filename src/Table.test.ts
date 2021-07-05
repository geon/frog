import { TestSuite, Test, expect } from "testyts";
import { addValue, getTableValues, getValue, makeEmptyTable } from "./Table";

@TestSuite()
export class TableTestSuite {
	@Test()
	makeEmptyTable() {
		const table = makeEmptyTable<string>();
		expect.arraysToBeEqual(getTableValues(table) as any, []);
	}

	@Test()
	addValueToTable() {
		const table = makeEmptyTable<string>();
		addValue(table, "geon");
		expect.arraysToBeEqual(getTableValues(table) as any, ["geon"]);
	}

	@Test()
	addValuesToTable() {
		const table = makeEmptyTable<string>();
		addValue(table, "geon");
		addValue(table, "neon");
		expect.arraysToBeEqual(getTableValues(table) as any, ["geon", "neon"]);
	}

	@Test()
	getValueById() {
		const table = makeEmptyTable<string>();
		const geonId = addValue(table, "geon");
		const neonId = addValue(table, "neon");
		expect.toBeEqual(getValue(table, geonId), "geon");
		expect.toBeEqual(getValue(table, neonId), "neon");
	}
}
