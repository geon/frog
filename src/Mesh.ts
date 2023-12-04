import { Coord3 } from "./Coord3";

export interface Corner {
	firstHalfEdge: HalfEdge;
	position: Coord3;
}

export interface Polygon {
	firstHalfEdge: HalfEdge;
}

export interface HalfEdge {
	corner: Corner;
	polygon: Polygon;
	// Next half-edge around the corner clockwise.
	next: HalfEdge;
	// The other half of the half-edge.
	twin: HalfEdge;
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

	static polygonEdgeCount(polygon: Polygon): number | undefined {
		let count = 0;
		let halfEdge = polygon.firstHalfEdge;
		do {
			// Implementation is identical to cornerEdgeCount, except for this line.
			halfEdge = halfEdge.twin.next;
			++count;
			if (count > 1000) {
				return undefined;
			}
			if (halfEdge.polygon !== polygon) {
				return undefined;
			}
		} while (halfEdge !== polygon.firstHalfEdge);
		return count;
	}
}
