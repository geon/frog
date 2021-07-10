const mutableMarker = Symbol("mutable marker");
type MutableMarker = typeof mutableMarker;

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
} & {
	[mutableMarker]: MutableMarker;
};

export function makeMutable<T>(value: T): Mutable<T> {
	return { ...value, [mutableMarker]: mutableMarker };
}

export type TwoDeepMutable<T> = {
	-readonly [P in keyof T]: Mutable<T[P]>;
} & {
	[mutableMarker]: MutableMarker;
};
