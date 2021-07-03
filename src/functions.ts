/**
Range of number from (including), to (not including).
*/
export function* makeRange(to: number, from: number = 0) {
	for (let i = from; i < to; ++i) {
		yield i;
	}
}
