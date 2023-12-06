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
				return count !== undefined && count >= 2;
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

	/*
	The new polygon will be 2-sided, between the old edge and the new.
	I choose the old edge to be on top in the diagram. The left "+" is the  halfEdge's corner.
	When a half-edge is facing a corner, its polygon is to its right side.
	   |        |
	---+========+---
	   |        |
	*/
	splitEdge(halfEdge: HalfEdge): {
		newPolygon: Polygon;
	} {
		const newPolygon: Polygon = {
			firstHalfEdge: halfEdge.twin,
		};

		// Copy the existing edge.
		const newHalfEdgeA: HalfEdge = { ...halfEdge };
		const newHalfEdgeB: HalfEdge = { ...halfEdge.twin };

		// Make the new half-edges a pair.
		newHalfEdgeA.twin = newHalfEdgeB;
		newHalfEdgeB.twin = newHalfEdgeA;

		// Insert the new half-edges around their corners.
		// Left corner:
		halfEdge.next = newHalfEdgeA;
		// Right corner:
		Mesh.prevHalfEdgeAroundCorner(halfEdge.twin).next = newHalfEdgeB;
		newHalfEdgeB.next = halfEdge.twin;

		// Insert the polygon between the edges.
		// Edges go ccw around polygons.
		halfEdge.twin.polygon.firstHalfEdge = newHalfEdgeB;
		halfEdge.twin.polygon = newPolygon;
		newHalfEdgeA.polygon = newPolygon;

		this.polygons.push(newPolygon);
		this.halfEdges.push(newHalfEdgeA, newHalfEdgeB);

		return { newPolygon };
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

	static polygonHalfEdges(polygon: Polygon): Array<HalfEdge> {
		const polygonHalfEdges: Array<HalfEdge> = [];
		let halfEdge = polygon.firstHalfEdge;
		do {
			polygonHalfEdges.push(halfEdge);
			halfEdge = halfEdge.twin.next;
		} while (halfEdge !== polygon.firstHalfEdge);
		return polygonHalfEdges;
	}

	static prevHalfEdgeAroundCorner(halfEdge: HalfEdge): HalfEdge {
		let current = halfEdge;
		while (current.next !== halfEdge) {
			current = current.next;
		}
		return current;
	}

	static halfEdgesAroundCorner(corner: Corner): Array<HalfEdge> {
		const halfEdges: Array<HalfEdge> = [];
		let halfEdge = corner.firstHalfEdge;
		do {
			halfEdges.push(halfEdge);
			halfEdge = halfEdge.next;
		} while (halfEdge !== corner.firstHalfEdge);
		return halfEdges;
	}

	static polygonsAroundCorner(corner: Corner): Array<Polygon> {
		return Mesh.halfEdgesAroundCorner(corner).map(
			(halfEdge) => halfEdge.polygon,
		);
	}
}
