// import { TwoDeepReadonly } from "./DeepReadonly";
import { makeMutable, Mutable } from "./Mutable";

export type TableId = number;

export interface Table<T> {
	readonly nextId: TableId;
	readonly values: Record<TableId, T>;
}

export type MutableTable<T> = Mutable<Table<T>>;

export function makeEmptyTable<T>(): MutableTable<T> {
	return makeMutable({
		nextId: 0,
		values: {},
	});
}

export function getValues<T>(table: Table<T>): readonly T[] {
	return Object.values(table.values);
}

export function addValue<T extends { id: TableId }>(
	table: MutableTable<T>,
	value: Omit<T, "id">,
): T {
	const id = table.nextId;
	table.nextId++;
	const valueAsT = { ...value, id } as T;
	table.values[id] = valueAsT;
	return valueAsT;
}

export function getValue<T>(table: Table<T>, id: TableId): Readonly<T> {
	const value = table.values[id];
	if (!value) {
		throw new Error("Bad id: " + id);
	}
	return table.values[id];
}

export function setValue<T>(
	table: MutableTable<T>,
	id: TableId,
	value: T,
): void {
	table.values[id] = value;
}
