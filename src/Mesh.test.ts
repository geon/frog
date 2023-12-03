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
		next: null!,
	};

	corner.firstHalfEdge = halfEdge;
	halfEdge.next = halfEdge;

	expect(Mesh.cornerEdgeCount(corner)).toBe(1);
});

test("cornerEdgeCount 2", () => {
	const corner: Corner = {
		position: new Coord3({ x: 0, y: 0, z: 0 }),
		firstHalfEdge: null!,
	};
	const halfEdgeA: HalfEdge = {
		next: null!,
	};
	const halfEdgeB: HalfEdge = {
		next: null!,
	};

	corner.firstHalfEdge = halfEdgeA;
	halfEdgeA.next = halfEdgeB;
	halfEdgeB.next = halfEdgeA;

	expect(Mesh.cornerEdgeCount(corner)).toBe(2);
});
