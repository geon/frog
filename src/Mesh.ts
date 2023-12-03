import { Coord3 } from "./Coord3";

export interface Corner {
	firstHalfEdge: HalfEdge;
	position: Coord3;
}

export interface HalfEdge {
	corner: Corner;
	// Next half-edge around the corner clockwise.
	next: HalfEdge;
}

export class Mesh {
	constructor() {}

	static cornerEdgeCount(corner: Corner): number | undefined {
		let count = 0;
		let halfEdge = corner.firstHalfEdge;
		do {
			halfEdge = halfEdge.next;
			++count;
			// This is an arbitrary limit. Prevent acyclics graphs from crashing.
			if (count > 1000) {
				return undefined;
			}
			if (halfEdge.corner !== corner) {
				return undefined;
			}
		} while (halfEdge !== corner.firstHalfEdge);
		return count;
	}
}
