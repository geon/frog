import { TwoDeepReadonly } from "./DeepReadonly";

export type TableId = number;

export interface MutableTable<T> {
	nextId: TableId;
	values: Record<TableId, T>;
}

export type Table<T> = TwoDeepReadonly<MutableTable<T>>;

export function makeEmptyTable<T>(): Table<T> {
	return {
		nextId: 0,
		values: {},
	};
}

export function getValues<T>(table: Table<T>): readonly T[] {
	return Object.values(table.values);
}

export function addValue<T>(table: MutableTable<T>, value: T): TableId {
	const id = table.nextId;
	table.nextId++;
	table.values[id] = value;
	return id;
}

export function getValue<T>(table: Table<T>, id: TableId): T {
	return table.values[id];
}
