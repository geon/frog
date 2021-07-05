import { TestSuite, Test, expect } from "testyts";
import { addValue, getTableValues, makeEmptyTable } from "./Table";

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
}
