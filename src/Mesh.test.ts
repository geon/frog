import { expect, test } from "vitest";
import { Corner, HalfEdge, Mesh, Polygon } from "./Mesh";
import { Coord3 } from "./Coord3";

test("new Mesh", () => {
	new Mesh();
});

function makeDisconnectedHalfEdge(): HalfEdge {
	return {
		corner: null!,
		polygon: null!,
		next: null!,
		twin: null!,
	};
}

test("cornerEdgeCount 1", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdge = makeDisconnectedHalfEdge();

	corner.firstHalfEdge = halfEdge;
	halfEdge.corner = corner;
	halfEdge.next = halfEdge;

	expect(Mesh.cornerEdgeCount(corner)).toBe(1);
});

test("cornerEdgeCount 2", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdgeA = makeDisconnectedHalfEdge();
	const halfEdgeB = makeDisconnectedHalfEdge();

	corner.firstHalfEdge = halfEdgeA;
	halfEdgeA.corner = corner;
	halfEdgeB.corner = corner;
	halfEdgeA.next = halfEdgeB;
	halfEdgeB.next = halfEdgeA;

	expect(Mesh.cornerEdgeCount(corner)).toBe(2);
});

test("cornerEdgeCount acyclic", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdgeA = makeDisconnectedHalfEdge();
	const halfEdgeB = makeDisconnectedHalfEdge();

	corner.firstHalfEdge = halfEdgeA;
	halfEdgeA.corner = corner;
	halfEdgeB.corner = corner;
	halfEdgeA.next = halfEdgeB;
	halfEdgeB.next = halfEdgeB;

	expect(Mesh.cornerEdgeCount(corner)).toBe(undefined);
});

test("cornerEdgeCount broken", () => {
	const cornerA: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const cornerB: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdge = makeDisconnectedHalfEdge();

	cornerA.firstHalfEdge = halfEdge;
	halfEdge.next = halfEdge;
	halfEdge.corner = cornerB;

	expect(Mesh.cornerEdgeCount(cornerA)).toBe(undefined);
});

function makeDisconnectedHalfEdgePair(): [HalfEdge, HalfEdge] {
	const a = makeDisconnectedHalfEdge();
	const b = makeDisconnectedHalfEdge();
	a.twin = b;
	b.twin = a;
	return [a, b];
}

test("polygonEdgeCount 1", () => {
	const polygon: Polygon = {
		firstHalfEdge: null!,
	};
	const [halfEdgeA, halfEdgeB] = makeDisconnectedHalfEdgePair();

	polygon.firstHalfEdge = halfEdgeA;
	halfEdgeA.polygon = polygon;

	// The polygon has a single edge.
	halfEdgeB.next = halfEdgeA;

	expect(Mesh.polygonEdgeCount(polygon)).toBe(1);
});

test("polygonEdgeCount 2", () => {
	const polygon: Polygon = {
		firstHalfEdge: null!,
	};
	const [halfEdgeA, halfEdgeB] = makeDisconnectedHalfEdgePair();
	const [halfEdgeC, halfEdgeD] = makeDisconnectedHalfEdgePair();

	polygon.firstHalfEdge = halfEdgeA;
	halfEdgeA.polygon = polygon;
	halfEdgeC.polygon = polygon;

	halfEdgeB.next = halfEdgeC;
	halfEdgeD.next = halfEdgeA;

	expect(Mesh.polygonEdgeCount(polygon)).toBe(2);
});

test("polygonEdgeCount acyclic", () => {
	const polygon: Polygon = {
		firstHalfEdge: null!,
	};
	const [halfEdgeA, halfEdgeB] = makeDisconnectedHalfEdgePair();
	const [halfEdgeC, halfEdgeD] = makeDisconnectedHalfEdgePair();

	polygon.firstHalfEdge = halfEdgeA;
	halfEdgeA.polygon = polygon;
	halfEdgeC.polygon = polygon;

	halfEdgeB.next = halfEdgeC;
	halfEdgeD.next = halfEdgeC;
	halfEdgeC.next = halfEdgeD;

	expect(Mesh.polygonEdgeCount(polygon)).toBe(undefined);
});

test("polygonEdgeCount broken", () => {
	const polygonA: Polygon = {
		firstHalfEdge: null!,
	};
	const polygonB: Polygon = {
		firstHalfEdge: null!,
	};
	const [halfEdgeA, halfEdgeB] = makeDisconnectedHalfEdgePair();
	const [halfEdgeC, halfEdgeD] = makeDisconnectedHalfEdgePair();

	polygonA.firstHalfEdge = halfEdgeA;
	halfEdgeA.polygon = polygonA;
	halfEdgeC.polygon = polygonB;

	halfEdgeB.next = halfEdgeC;
	halfEdgeD.next = halfEdgeA;

	expect(Mesh.polygonEdgeCount(polygonA)).toBe(undefined);
});

test("makeSquare/isValid", () => {
	const mesh = Mesh.makeSquare();
	expect(mesh.corners.length).toBe(4);
	expect(mesh.polygons.length).toBe(2);
	expect(mesh.halfEdges.length).toBe(8);
	expect(mesh.isValid()).toBe(true);
});

test("polygonHalfEdges", () => {
	const mesh = Mesh.makeSquare();
	const polygonHalfEdges = Mesh.polygonHalfEdges(mesh.polygons[0]!);
	expect(polygonHalfEdges.length).toBe(4);
});

test("prevHalfEdgeAroundCorner", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdgeA = makeDisconnectedHalfEdge();
	const halfEdgeB = makeDisconnectedHalfEdge();
	const halfEdgeC = makeDisconnectedHalfEdge();

	corner.firstHalfEdge = halfEdgeA;
	halfEdgeA.corner = corner;
	halfEdgeB.corner = corner;
	halfEdgeC.corner = corner;

	halfEdgeA.next = halfEdgeB;
	halfEdgeB.next = halfEdgeC;
	halfEdgeC.next = halfEdgeA;

	expect(Mesh.prevHalfEdgeAroundCorner(corner.firstHalfEdge)).toBe(halfEdgeC);
});
