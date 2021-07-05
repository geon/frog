export type DeepReadonly<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type TwoDeepReadonly<T> = {
	readonly [P in keyof T]: Readonly<T[P]>;
};
