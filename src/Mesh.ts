import { Coord3 } from "./Coord3";

export interface Corner {
	firstHalfEdge: HalfEdge;
	position: Coord3;
}

export interface HalfEdge {
	// Next half-edge around the corner clockwise.
	next: HalfEdge;
}

export class Mesh {
	constructor() {}

	static cornerEdgeCount(corner: Corner): number {
		let count = 0;
		let halfEdge = corner.firstHalfEdge;
		do {
			halfEdge = halfEdge.next;
			++count;
		} while (halfEdge !== corner.firstHalfEdge);
		return count;
	}
}
