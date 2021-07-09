import { TwoDeepReadonly } from "./DeepReadonly";

export type TableId = number;

export interface MutableTable<T> {
	nextId: TableId;
	values: Record<TableId, T>;
}

export type Table<T> = TwoDeepReadonly<MutableTable<T>>;

export function makeEmptyTable<T>(): MutableTable<T> {
	return {
		nextId: 0,
		values: {},
	};
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
	return table.values[id];
}

export function setValue<T>(
	table: MutableTable<T>,
	id: TableId,
	value: T,
): void {
	table.values[id] = value;
}
