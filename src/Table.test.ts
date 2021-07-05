import { TestSuite, Test, expect } from "testyts";
import { getTableValues, makeEmptyTable } from "./Table";

@TestSuite()
export class TableTestSuite {
	@Test()
	makeEmptyTable() {
		const table = makeEmptyTable<string>();
		expect.toBeEqual(getTableValues(table).length, 0);
	}
}
