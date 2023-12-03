import { expect, test } from "vitest";
import { Coord3 } from "./Coord3";
import {
	addEdges,
	extrudeCorner,
	getCornersOfPolygon,
	makeEmptyMesh,
} from "./Mesh";
import { getValues } from "./Table";

test("makeEmptyMesh", () => {
	const mesh = makeEmptyMesh();
	expect(getValues(mesh.halfEdges).length).toBe(0);
	expect(getValues(mesh.polygons).length).toBe(0);
	expect(getValues(mesh.corners).length).toBe(0);
});

test("addEdge", () => {
	const { mesh } = makeOneEdgeMesh();
	expect(getValues(mesh.corners).length).toBe(2);
});

test("verifyMeshIntegrity", () => {
	const { mesh } = makeOneEdgeMesh();
	expect(
		[...getCornersOfPolygon(mesh, getValues(mesh.polygons)[0])].length,
	).toBe(2);
});

test("extrudeCorner", () => {
	const { mesh } = makeOneEdgeMesh();
	const { newHalfEdges, newPolygon } = extrudeCorner(
		mesh,
		getValues(mesh.corners)[1],
	);
	expect(getValues(mesh.halfEdges).length).toBe(4);
	expect(newHalfEdges[0].polygonId).toBe(newPolygon.id);
	expect(newHalfEdges[1].polygonId).toBe(newPolygon.id);
	expect(newHalfEdges[0].nextEdgeIdAroundPolygon).toBe(newHalfEdges[1].id);
	expect(newHalfEdges[1].nextEdgeIdAroundPolygon).toBe(newHalfEdges[0].id);
});

function makeOneEdgeMesh() {
	const mesh = makeEmptyMesh();

	const positions = [
		new Coord3({ x: -1, y: 0, z: 0 }),
		new Coord3({ x: 1, y: 0, z: 0 }),
	];

	const edge = addEdges(mesh, positions);

	return {
		mesh,
		edge,
	};
}

// function makeOneEdgeMesh() {
// 	const { mesh, corner } = makeOneCornerMesh();
// 	extrudeCorner(mesh, corner, new Coord3({ x: 1, y: 0, z: 0 }));
// 	return mesh;
// }
