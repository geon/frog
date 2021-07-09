import { TestSuite, Test, expect } from "testyts";
import {
	addValue,
	getValues,
	getValue,
	makeEmptyTable,
	setValue,
} from "./Table";

@TestSuite()
export class TableTestSuite {
	@Test()
	makeEmptyTable() {
		const table = makeEmptyTable<string>();
		expect.arraysToBeEqual(getValues(table) as any, []);
	}

	@Test()
	addValueToTable() {
		const table = makeEmptyTable<{ id: number; value: string }>();
		addValue(table, { value: "geon" });
		expect.toBeEqual(getValues(table)[0].value, "geon");
	}

	@Test()
	addValuesToTable() {
		const table = makeEmptyTable<{ id: number; value: string }>();
		addValue(table, { value: "geon" });
		addValue(table, { value: "neon" });
		expect.arraysToBeEqual(
			getValues(table).map((x) => x.value),
			["geon", "neon"],
		);
	}

	@Test()
	getValueById() {
		const table = makeEmptyTable<{ id: number; value: string }>();
		const geonId = addValue(table, { value: "geon" }).id;
		const neonId = addValue(table, { value: "neon" }).id;
		expect.toBeEqual(getValue(table, geonId).value, "geon");
		expect.toBeEqual(getValue(table, neonId).value, "neon");
	}

	@Test()
	setValueById() {
		const table = makeEmptyTable<string>();
		setValue(table, 1, "geon");
		setValue(table, 2, "neon");
		expect.toBeEqual(getValue(table, 1), "geon");
		expect.toBeEqual(getValue(table, 2), "neon");
	}
}
