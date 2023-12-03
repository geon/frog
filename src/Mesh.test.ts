import { expect, test } from "vitest";
import { Corner, HalfEdge, Mesh } from "./Mesh";
import { Coord3 } from "./Coord3";

test("new Mesh", () => {
	new Mesh();
});

test("cornerEdgeCount 1", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdge: HalfEdge = {
		corner: undefined!,
		next: undefined!,
	};

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
	const halfEdgeA: HalfEdge = {
		corner: null!,
		next: null!,
	};
	const halfEdgeB: HalfEdge = {
		corner: null!,
		next: null!,
	};

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
	const halfEdgeA: HalfEdge = {
		corner: null!,
		next: null!,
	};
	const halfEdgeB: HalfEdge = {
		corner: null!,
		next: null!,
	};

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
	const halfEdge: HalfEdge = {
		corner: null!,
		next: null!,
	};

	cornerA.firstHalfEdge = halfEdge;
	halfEdge.next = halfEdge;
	halfEdge.corner = cornerB;

	expect(Mesh.cornerEdgeCount(cornerA)).toBe(undefined);
});
