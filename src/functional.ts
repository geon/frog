export function allPairs<T>(array: ReadonlyArray<T>): Array<[T, T]> {
	const pairs: Array<[T, T]> = [];
	for (let i = 0; i < array.length - 1; ++i) {
		pairs.push([array[i]!, array[i + 1]!]);
	}
	return pairs;
}
