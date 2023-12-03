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
	corners: Array<Corner> = [];
	polygons: Array<Polygon> = [];
	halfEdges: Array<HalfEdge> = [];

	constructor() {}

	// A mesh may not have degenerate edges or polygons. The simplest
	// valid mesh is a triangle with one polygon on each side.
	isValid(): boolean {
		// Check that each corner and polygon has a valid graph.
		return (
			this.corners.every((corner) => {
				const count = Mesh.cornerEdgeCount(corner);
				// count == 1 would be a single half-edge referring to itself.
				return count !== undefined && count >= 2;
			}) &&
			this.polygons.every((polygon) => {
				const count = Mesh.polygonEdgeCount(polygon);
				// 2-sided polygons are topologically valid, but can't be rendered.
				return count !== undefined && count >= 3;
			}) &&
			this.halfEdges.every(
				// halfEdge.twin.twin should reference itself.
				(halfEdge) => halfEdge.twin.twin == halfEdge,
			)
		);
	}

	/*
	Half-edges e(n) and corners c(n) reference each other like this:
	c0 < e0 e4 > c1
	^             ^
	e7           e1

	e3           e5
	v             v
	c3 < e6 e2 > c2
	*/
	static makeSquare(): Mesh {
		const mesh = new Mesh();
		const corners: [Corner, Corner, Corner, Corner] = [
			{ position: new Coord3({ x: -1, y: 1, z: 0 }), firstHalfEdge: null! },
			{ position: new Coord3({ x: 1, y: 1, z: 0 }), firstHalfEdge: null! },
			{ position: new Coord3({ x: 1, y: -1, z: 0 }), firstHalfEdge: null! },
			{ position: new Coord3({ x: -1, y: -1, z: 0 }), firstHalfEdge: null! },
		];
		const polygons: [Polygon, Polygon] = [
			{ firstHalfEdge: null! },
			{ firstHalfEdge: null! },
		];
		const halfEdges: [
			HalfEdge,
			HalfEdge,
			HalfEdge,
			HalfEdge,
			HalfEdge,
			HalfEdge,
			HalfEdge,
			HalfEdge,
		] = [
			{ corner: corners[0], polygon: polygons[0], next: null!, twin: null! },
			{ corner: corners[1], polygon: polygons[0], next: null!, twin: null! },
			{ corner: corners[2], polygon: polygons[0], next: null!, twin: null! },
			{ corner: corners[3], polygon: polygons[0], next: null!, twin: null! },
			{ corner: corners[0], polygon: polygons[1], next: null!, twin: null! },
			{ corner: corners[1], polygon: polygons[1], next: null!, twin: null! },
			{ corner: corners[2], polygon: polygons[1], next: null!, twin: null! },
			{ corner: corners[3], polygon: polygons[1], next: null!, twin: null! },
		];

		corners[0].firstHalfEdge = halfEdges[0];
		corners[1].firstHalfEdge = halfEdges[1];
		corners[2].firstHalfEdge = halfEdges[2];
		corners[3].firstHalfEdge = halfEdges[3];

		polygons[0].firstHalfEdge = halfEdges[0];
		polygons[1].firstHalfEdge = halfEdges[4];

		halfEdges[0].corner = corners[0];
		halfEdges[1].corner = corners[1];
		halfEdges[2].corner = corners[2];
		halfEdges[3].corner = corners[3];

		halfEdges[4].corner = corners[1];
		halfEdges[5].corner = corners[2];
		halfEdges[6].corner = corners[3];
		halfEdges[7].corner = corners[0];

		halfEdges[0].next = halfEdges[7];
		halfEdges[1].next = halfEdges[4];
		halfEdges[2].next = halfEdges[5];
		halfEdges[3].next = halfEdges[6];

		halfEdges[4].next = halfEdges[1];
		halfEdges[5].next = halfEdges[2];
		halfEdges[6].next = halfEdges[3];
		halfEdges[7].next = halfEdges[0];

		halfEdges[0].twin = halfEdges[4];
		halfEdges[1].twin = halfEdges[5];
		halfEdges[2].twin = halfEdges[6];
		halfEdges[3].twin = halfEdges[7];

		halfEdges[4].twin = halfEdges[0];
		halfEdges[5].twin = halfEdges[1];
		halfEdges[6].twin = halfEdges[2];
		halfEdges[7].twin = halfEdges[3];

		mesh.corners = corners;
		mesh.polygons = polygons;
		mesh.halfEdges = halfEdges;

		return mesh;
	}

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
