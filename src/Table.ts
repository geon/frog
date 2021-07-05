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

export function getTableValues<T>(table: Table<T>): readonly T[] {
	return Object.values(table.values);
}
